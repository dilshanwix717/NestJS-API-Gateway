import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthRequest } from '@/common/interfaces/auth-request.interface';
import type { JwtPayload } from '@/lib/auth/jwt-payload';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload | undefined => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    return req.user;
  },
);
