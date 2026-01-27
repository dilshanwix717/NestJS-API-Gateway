import { ProfileResponseDto } from './profile-response.dto';

export class ProfileListResponseDto {
  data: ProfileResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
