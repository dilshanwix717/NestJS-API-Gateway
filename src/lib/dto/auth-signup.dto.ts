// apps/api-gateway/src/lib/dto/auth-signup.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

/**
 * Required user-profile fields collected at sign-up.
 *
 * The API gateway validates these and forwards them to the Auth service,
 * which in turn calls the User service (via RabbitMQ) to create the
 * user profile and default user status.
 */
export class SignUpProfileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phone: string;
}

export class AuthSignUpRequestDto {
  @IsString()
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

  /**
   * Profile data forwarded to the User service during sign-up.
   * The Auth service uses this to create the user profile and default status.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SignUpProfileDto)
  profile: SignUpProfileDto;
}
