export interface ValidateTokenResponse {
    valid: boolean;
    user?: {
        userId: string;
        roles?: string[];
    };
    error?: string;
}
