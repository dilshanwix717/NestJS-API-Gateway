// apps/api-gateway/src/lib/dto/auth-signup.dto.ts
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsISO31661Alpha2,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthSignUpRequestDto {
  // ─── Auth Fields ───────────────────────────────────────
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  // ─── Profile Fields ────────────────────────────────────
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsISO31661Alpha2()
  country?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
