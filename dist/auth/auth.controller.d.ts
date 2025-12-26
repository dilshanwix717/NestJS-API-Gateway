import { AuthLoginRequestDto } from '@/lib/dto/auth-login.dto';
import { AuthSignUpRequestDto } from '@/lib/dto/auth-signup.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: AuthLoginRequestDto): Promise<unknown>;
    signUp(body: AuthSignUpRequestDto): Promise<unknown>;
}
