import { AuthLoginRequestDto } from '@/lib/dto/auth-login.dto';
import { AuthSignUpRequestDto } from '@/lib/dto/auth-signup.dto';
import { AuthService } from './auth.service';
import type { AuthLoginResponseDto } from '@/lib/dto/auth-login-response.dto';
import type { AuthSignUpResponseDto } from '@/lib/dto/auth-signup-response.dto';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    signUp(body: AuthSignUpRequestDto): Promise<AuthSignUpResponseDto>;
    login(body: AuthLoginRequestDto): Promise<AuthLoginResponseDto>;
}
