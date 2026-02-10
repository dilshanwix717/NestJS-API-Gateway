// FILE: apps/api-gateway/src/lib/dto/auth-signup-response.dto.ts
// ============================================
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Profile snapshot returned after sign-up.
 *
 * Contains only the fields that are meaningful to the caller right after
 * registration — full profile details are available via the User service
 * endpoints.
 */
export class SignUpProfileResponseDto {
  @IsString()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

/**
 * Response returned after successful user registration.
 *
 * The Auth service creates the auth record and orchestrates user-profile
 * + user-status creation in the User service. This DTO surfaces both the
 * auth identity and the newly-created profile summary.
 */
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

  /** Profile created in the User service (may be absent on partial failure). */
  @IsOptional()
  @ValidateNested()
  @Type(() => SignUpProfileResponseDto)
  profile?: SignUpProfileResponseDto;
}
