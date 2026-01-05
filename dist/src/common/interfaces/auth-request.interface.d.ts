import type { Request } from 'express';
import type { JwtPayload } from '@/lib/auth/jwt-payload';
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
