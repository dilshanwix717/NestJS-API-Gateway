// apps/api-gateway/src/lib/dto/auth-login.dto.ts

import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthLoginRequestDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}
