// apps/api-gateway/src/lib/dto/auth-login-response.dto.ts
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../enum/user-role.enum';

export class AuthLoginUserDto {
  @IsString()
  readonly userId: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly roles?: UserRole[];
}

export class AuthLoginResponseDto {
  @IsString()
  readonly accessToken: string;

  @IsOptional()
  @IsString()
  readonly refreshToken?: string;

  @ValidateNested()
  @Type(() => AuthLoginUserDto)
  readonly user: AuthLoginUserDto;
}
