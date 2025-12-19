export interface AuthLoginResponseDto {
    accessToken: string;
    refreshToken?: string;
    user: {
        userId: string;
        email?: string;
        roles?: string[];
    };
}
