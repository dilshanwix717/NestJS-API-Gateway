// apps/api-gateway/src/lib/dto/auth-login-response.dto.ts

export interface AuthLoginResponseDto {
  accessToken: string;
  refreshToken?: string;
  user: {
    userId: string;
    email?: string;
    roles?: string[];
  };
}
