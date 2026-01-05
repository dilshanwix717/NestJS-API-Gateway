// Create constants file: common/constants/services.constants.ts
/**
 * Service names for ClientProxy injection
 */
export const SERVICES = {
  AUTH: 'AUTH-SERVICE',
  USER: 'USER-SERVICE',
} as const;

export type ServiceName = (typeof SERVICES)[keyof typeof SERVICES];
