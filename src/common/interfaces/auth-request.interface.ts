import type { Request } from 'express';
import type { JwtPayload } from '@/lib/auth/jwt-payload';

export interface AuthRequest extends Request {
  // optional until guard runs; controllers that use GetUser should expect JwtPayload | undefined
  user?: JwtPayload;
}
