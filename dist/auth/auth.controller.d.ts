import type { ClientProxy } from '@nestjs/microservices';
import type { AuthLoginRequestDto } from '@/lib/dto/auth-login.dto';
import type { AuthLoginResponseDto } from '@/lib/dto/auth-login-response.dto';
export declare class AuthController {
    private readonly authClient;
    constructor(authClient: ClientProxy);
    login(body: AuthLoginRequestDto): Promise<AuthLoginResponseDto>;
}
