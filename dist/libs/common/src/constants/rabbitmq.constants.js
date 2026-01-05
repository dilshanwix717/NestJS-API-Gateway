"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_RABBITMQ_CONFIG = exports.MESSAGE_PATTERNS = exports.QUEUES = exports.SERVICES = void 0;
exports.SERVICES = {
    AUTH: 'AUTH-SERVICE',
    USER: 'USER-SERVICE',
};
exports.QUEUES = {
    AUTH_QUEUE: 'auth_queue',
    USER_QUEUE: 'user_queue',
};
exports.MESSAGE_PATTERNS = {
    AUTH_SIGNUP: 'auth.signup',
    AUTH_LOGIN: 'auth.login',
    AUTH_VALIDATE_TOKEN: 'auth.validate-token',
    USER_CREATE: 'user.create',
    USER_FIND_BY_ID: 'user.find-by-id',
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',
};
exports.DEFAULT_RABBITMQ_CONFIG = {
    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
    queueOptions: {
        durable: true,
        noAck: false,
        prefetchCount: 1,
    },
};
//# sourceMappingURL=rabbitmq.constants.js.map