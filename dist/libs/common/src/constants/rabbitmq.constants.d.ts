export declare const SERVICES: {
    readonly AUTH: "AUTH-SERVICE";
    readonly USER: "USER-SERVICE";
};
export declare const QUEUES: {
    readonly AUTH_QUEUE: "auth_queue";
    readonly USER_QUEUE: "user_queue";
};
export declare const MESSAGE_PATTERNS: {
    readonly AUTH_SIGNUP: "auth.signup";
    readonly AUTH_LOGIN: "auth.login";
    readonly AUTH_VALIDATE_TOKEN: "auth.validate-token";
    readonly USER_CREATE: "user.create";
    readonly USER_FIND_BY_ID: "user.find-by-id";
    readonly USER_UPDATE: "user.update";
    readonly USER_DELETE: "user.delete";
};
export interface RabbitMQConfig {
    urls: string[];
    queue: string;
    queueOptions?: {
        durable: boolean;
        noAck?: boolean;
        prefetchCount?: number;
    };
}
export declare const DEFAULT_RABBITMQ_CONFIG: {
    readonly urls: readonly [string];
    readonly queueOptions: {
        readonly durable: true;
        readonly noAck: false;
        readonly prefetchCount: 1;
    };
};
