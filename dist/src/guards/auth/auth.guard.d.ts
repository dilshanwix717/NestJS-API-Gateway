import { CanActivate, ExecutionContext } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
export declare class AuthGuard implements CanActivate {
    private readonly authClient;
    private readonly logger;
    constructor(authClient: ClientProxy);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
