// apps/api-gateway/src/auth/auth.service.ts
// ===========================================

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import util from 'util';
import type { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from 'libs/common/src/constants/rabbitmq.constants';
import { catchError, firstValueFrom, timeout, throwError } from 'rxjs';

/**
 * Standard error response structure from microservices
 */
interface MicroserviceError {
  statusCode?: number;
  status?: number;
  message?: string;
  error?: string;
}

/**
 * Auth Service - Gateway layer for Auth microservice communication
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // Request timeout in milliseconds
  private readonly msRequestTimeout =
    Number(process.env.MS_REQUEST_TIMEOUT) || 10000;

  constructor(
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
  ) {}

  /**
   * Sends a message to the Auth microservice via RabbitMQ
   *
   * @template Req - Request payload type
   * @template Res - Response payload type
   * @param pattern - Message pattern (routing key)
   * @param data - Request payload
   * @returns Promise with microservice response
   * @throws HttpException on timeout or microservice error
   */
  async send<Req, Res>(pattern: string, data: Req): Promise<Res> {
    this.logger.log(`Sending message to Auth service: ${pattern}`);

    try {
      const result$ = this.authClient.send<Res, Req>(pattern, data).pipe(
        timeout(this.msRequestTimeout),
        catchError((error) => {
          // Helper to safely extract typed values from unknown objects
          const getProperty = (obj: unknown, prop: string): unknown =>
            typeof obj === 'object' && obj !== null && prop in obj
              ? (obj as Record<string, unknown>)[prop]
              : undefined;

          // Helper to safely extract string values
          const getString = (value: unknown): string =>
            typeof value === 'string' ? value : '';

          // build a safe error object for logging — don't pass the raw AMQP object
          const safeError =
            error instanceof Error
              ? {
                  name: error.name,
                  message: error.message,
                  // keep stack separate (logger may handle it)
                  stack: getString(getProperty(error, 'stack')),
                  // If microservice uses RpcException and includes `.response`, log its safe parts
                  response: (() => {
                    const response = getProperty(error, 'response');
                    return typeof response === 'object' && response !== null
                      ? {
                          // copy only small, useful fields
                          statusCode: getProperty(response, 'statusCode'),
                          message: getProperty(response, 'message'),
                          error: getProperty(response, 'error'),
                        }
                      : undefined;
                  })(),
                }
              : // fallback for non-Error objects (stringify safely)
                (() => {
                  try {
                    const parsed = JSON.parse(JSON.stringify(error)) as unknown;
                    return { raw: parsed };
                  } catch {
                    // use util.inspect instead of JSON.stringify for circular objects
                    return { raw: util.inspect(error, { depth: 2 }) };
                  }
                })();

          this.logger.error(
            `Microservice error for pattern ${pattern}`,
            safeError,
          );
          return throwError(() => error as unknown);
        }),
      );

      const result = await firstValueFrom(result$);

      this.logger.log(`Received response from Auth service: ${pattern}`);

      return result;
    } catch (error) {
      this.logger.error(`Failed to communicate with Auth service:`, {
        pattern,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw this.mapMsErrorToHttp(error);
    }
  }

  /**
   * Maps microservice errors to HTTP exceptions
   */
  private mapMsErrorToHttp(error: unknown): HttpException {
    // If it's already an HttpException, pass through
    if (error instanceof HttpException) return error;

    // Type guard to safely access properties
    const getProperty = (obj: unknown, prop: string): unknown => {
      return typeof obj === 'object' && obj !== null && prop in obj
        ? (obj as Record<string, unknown>)[prop]
        : undefined;
    };

    // If the microservice returned a formatted response (RpcException -> .response)
    const msResponse = getProperty(error, 'response') ?? error;

    // If msResponse looks like a structured error, use it
    if (this.isMicroserviceError(msResponse)) {
      const statusCode =
        msResponse.statusCode || msResponse.status || HttpStatus.BAD_REQUEST;
      const message = msResponse.message || 'Microservice error';
      return new HttpException(
        {
          statusCode,
          message,
          error: msResponse.error || 'MicroserviceError',
        },
        statusCode,
      );
    }

    // Timeout detection (unchanged)
    if (error instanceof Error && error.name === 'TimeoutError') {
      return new HttpException(
        {
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'Auth service timeout',
          error: 'GatewayTimeout',
        },
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }

    // Generic Error fallback
    if (error instanceof Error) {
      return new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'InternalServerError',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'UnknownError',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  /**
   * Type guard for microservice error objects
   */
  private isMicroserviceError(error: unknown): error is MicroserviceError {
    return (
      typeof error === 'object' &&
      error !== null &&
      ('statusCode' in error || 'status' in error || 'message' in error)
    );
  }

  /**
   * Ensures RabbitMQ connection is established before first use
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.authClient.connect();
      this.logger.log(
        'Successfully connected to Auth microservice via RabbitMQ',
      );
    } catch (error) {
      this.logger.error('Failed to connect to Auth microservice:', error);
      // Don't throw - allow app to start but log connection issue
    }
  }

  /**
   * Cleanup RabbitMQ connection on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    try {
      await this.authClient.close();
      this.logger.log('Closed connection to Auth microservice');
    } catch (error) {
      this.logger.error('Error closing Auth microservice connection:', error);
    }
  }
}
