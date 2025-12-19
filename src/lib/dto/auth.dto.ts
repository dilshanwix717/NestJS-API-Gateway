// apps/api-gateway/src/lib/dto/auth.dto.ts
export interface ValidateTokenResponse {
  valid: boolean;
  userId?: string;
  role?: string;
}
