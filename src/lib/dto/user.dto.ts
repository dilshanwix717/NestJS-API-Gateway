//apps/api-gateway/src/lib/user.dto.ts
export interface UserDto {
  id: string;
  name: string;
  email?: string;
  // other user fields returned by the user-service
}
