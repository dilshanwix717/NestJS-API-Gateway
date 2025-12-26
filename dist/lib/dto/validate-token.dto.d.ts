export declare class ValidatedUserDto {
    userId: string;
    roles?: string[];
}
export declare class ValidateTokenResponseDto {
    valid: boolean;
    user?: ValidatedUserDto;
    error?: string;
}
