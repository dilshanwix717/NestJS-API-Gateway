export declare const SERVICES: {
    readonly AUTH: "AUTH-SERVICE";
    readonly USER: "USER-SERVICE";
};
export type ServiceName = (typeof SERVICES)[keyof typeof SERVICES];
