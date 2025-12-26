import type { ClientProxy } from '@nestjs/microservices';
export declare class AuthService {
    private readonly authClient;
    private readonly logger;
    private readonly msRequestTimeout;
    constructor(authClient: ClientProxy);
    send<Req, Res>(pattern: string, data: Req): Promise<Res>;
    private mapMsErrorToHttp;
}
