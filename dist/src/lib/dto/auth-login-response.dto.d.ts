import { UserRole } from '../enum/user-role.enum';
export declare class AuthLoginUserDto {
    readonly userId: string;
    readonly email?: string;
    readonly roles?: UserRole[];
}
export declare class AuthLoginResponseDto {
    readonly accessToken: string;
    readonly refreshToken?: string;
    readonly user: AuthLoginUserDto;
}
