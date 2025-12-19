// export interface ValidateTokenResponse {
//   valid: boolean;
//   userId?: string;
//   role?: string; // legacy single-role API
// }

// the shape the auth service returns when validating a token.
// I recommend returning a `user` object to keep the top-level response clear.

export interface ValidateTokenResponse {
  valid: boolean;
  // present only when valid === true
  user?: {
    userId: string;
    //email?: string;
    roles?: string[];
  };
  // Optional: an `error` field for debugging (do not leak to clients).
  error?: string;
}
