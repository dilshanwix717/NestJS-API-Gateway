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
import type { ValidateTokenResponseDto } from '@/lib/dto/validate-token.dto';
import type { AuthRequest } from '@/common/interfaces/auth-request.interface';
import type { JwtPayload } from '@/lib/auth/jwt-payload';
import { SERVICES } from '@/common/constants/services.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
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
      const result$ = this.authClient.send<ValidateTokenResponseDto, string>(
        'validate-token',
        token,
      );
      const result = await firstValueFrom(result$);
      if (!result?.valid || !result.user) {
        // log for observability but do not leak internals to client
        this.logger.warn(`Token validation failed for request to ${req.path}`);
        throw new UnauthorizedException('Invalid or expired token');
      }
      // Map the response user into our JwtPayload shape
      const user: JwtPayload = {
        userId: result.user.userId,
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
