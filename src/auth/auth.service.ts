import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { inspect } from 'util';
import { SERVICES } from '@/common/constants/services.constants';

/**
 * AuthService - Handles communication with the Auth microservice
 *
 * Responsibilities:
 * - Send requests to the Auth microservice with built-in timeout protection
 * - Handle microservice errors and map them to appropriate HTTP exceptions
 * - Log errors for debugging and observability
 *
 * Architecture:
 * - Uses NestJS ClientProxy for TCP microservice communication
 * - Implements timeout protection to prevent hanging requests
 * - Centralizes error handling and mapping logic
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // Request timeout in milliseconds. Configurable via MS_REQUEST_TIMEOUT env var, defaults to 5 seconds.
  private readonly msRequestTimeout =
    Number(process.env.MS_REQUEST_TIMEOUT) || 5000;

  constructor(
    // AUTH-SERVICE is a TCP microservice client configured in AppModule
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
  ) {}

  /**
   * Send a request to the Auth microservice with automatic timeout protection.
   *
   * @template Req - The request payload type
   * @template Res - The response payload type
   * @param pattern - The microservice message pattern (e.g., 'auth-login', 'auth-signup')
   * @param data - The request payload to send
   * @returns Promise resolving to the microservice response
   * @throws HttpException if request fails, times out, or microservice returns an error
   */
  async send<Req, Res>(pattern: string, data: Req): Promise<Res> {
    try {
      // Create an observable that will timeout if the microservice doesn't respond in time
      const result$ = this.authClient
        .send<Res, Req>(pattern, data)
        .pipe(timeout(this.msRequestTimeout));

      // Convert RxJS observable to a Promise for async/await usage
      return await firstValueFrom(result$);
    } catch (err) {
      // Log the raw error for debugging (safe stringification with inspect)
      this.logger.error(
        'Auth microservice error',
        inspect(err, { depth: null }),
      );
      // Convert microservice errors to appropriate HTTP exceptions for the client
      throw this.mapMsErrorToHttp(err);
    }
  }

  /**
   * Map microservice errors to appropriate HTTP exceptions.
   *
   * Error mapping strategy:
   * 1. If already an HttpException, return as-is (pass-through)
   * 2. If a timeout error, return 504 Gateway Timeout
   * 3. If an object with statusCode/status, extract and use that status
   * 4. Default to 500 Internal Server Error for unknown types
   *
   * This ensures consistent error responses to the client while preserving
   * meaningful error messages from the upstream microservice.
   *
   * @param error - The error thrown by the microservice or timeout handler
   * @returns HttpException with appropriate status code and message
   */
  private mapMsErrorToHttp(error: unknown): HttpException {
    // If already an HttpException, pass it through unchanged
    if (error instanceof HttpException) return error;

    // Timeout errors indicate the microservice was unresponsive
    if (error instanceof TimeoutError) {
      return new HttpException(
        'Upstream service timeout',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }

    // For object errors (typical microservice error responses), extract status and message
    if (typeof error === 'object' && error !== null) {
      const e = error as Record<string, unknown>;
      // Use the message if it's a string, otherwise stringify the whole object
      const message =
        typeof e.message === 'string' ? e.message : JSON.stringify(e);

      // Extract status code, defaulting to 400 Bad Request if not provided
      const statusCode =
        Number(e.statusCode ?? e.status) || HttpStatus.BAD_REQUEST;

      return new HttpException(message, statusCode);
    }

    // Fallback for unknown error types (should rarely occur)
    return new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
