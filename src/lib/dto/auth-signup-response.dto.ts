// FILE: apps/api-gateway/src/lib/dto/auth-signup-response.dto.ts
// ============================================
import { IsArray, IsEmail, IsString } from 'class-validator';

export class AuthSignUpResponseDto {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
