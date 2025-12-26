//apps/api-gateway/src/lib/user.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email?: string;

  // Add more validated fields as user-service evolves
}
