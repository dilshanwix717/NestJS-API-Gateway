// export interface ValidateTokenResponse {
//   valid: boolean;
//   userId?: string;
//   role?: string; // legacy single-role API
// }

// the shape the auth service returns when validating a token.
// I recommend returning a `user` object to keep the top-level response clear.

import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ValidatedUserDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}

export class ValidateTokenResponseDto {
  @IsBoolean()
  valid: boolean;

  // Present only when valid === true
  @IsOptional()
  @Type(() => ValidatedUserDto)
  user?: ValidatedUserDto;

  // Internal/debugging only (never forward to clients)
  @IsOptional()
  @IsString()
  error?: string;
}
