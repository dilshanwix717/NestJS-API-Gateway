// FILE: apps/user-service/src/profile/dto/create-profile.dto.ts
import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  IsISO31661Alpha2,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsUUID()
  authUserId!: string;

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
