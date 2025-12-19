import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { ValidateTokenResponse } from '@/lib/dto/validate-token.dto';
import type { AuthRequest } from '@/common/interfaces/auth-request.interface';
import type { JwtPayload } from '@/lib/auth/jwt-payload';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject('AUTH-SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader = (req.headers['authorization'] ??
      req.headers['Authorization']) as string | undefined;

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [scheme, token] = authHeader.split(' ');
    if (!token || scheme.toLowerCase() !== 'bearer') {
      throw new UnauthorizedException(
        'Invalid authorization header format. Expected: Bearer <token>',
      );
    }

    try {
      // Put the generic on send() — avoids unnecessary assertions and satisfies ESLint.
      const result$ = this.authClient.send<ValidateTokenResponse, string>(
        'validate-token',
        token,
      );
      const result = await firstValueFrom(result$);
      console.log('Validation result:', result);
      if (!result?.valid || !result.user) {
        // log for observability but do not leak internals to client
        this.logger.warn(`Token validation failed for request to ${req.path}`);
        console.log('Invalid token or missing user in validation result');
        console.log('Validation result details:', result.user);
        throw new UnauthorizedException('Invalid token');
      }
      console.log('Token validated successfully:', result);
      // Map the response user into our JwtPayload shape
      const user: JwtPayload = {
        userId: result.user.userId,
        //email: result.user.email,
        roles: result.user.roles,
      };

      req.user = user;
      return true;
    } catch (err) {
      this.logger.error('Token validation error', (err as Error).stack ?? err);
      // Always throw a user-facing UnauthorizedException for any validation error
      throw new UnauthorizedException('Invalid tokensss');
    }
  }
}
