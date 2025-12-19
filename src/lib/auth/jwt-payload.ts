// canonical shape of the authenticated user's payload used throughout the gateway
export interface JwtPayload {
  userId: string;
  email?: string;
  // prefer an array of roles (more flexible); if you want a single role, change to `role?: string`
  roles?: string[];
}
