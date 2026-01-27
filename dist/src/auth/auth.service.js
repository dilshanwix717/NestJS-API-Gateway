"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("util");
const rabbitmq_constants_1 = require("../../libs/common/src/constants/rabbitmq.constants");
const rxjs_1 = require("rxjs");
let AuthService = AuthService_1 = class AuthService {
    constructor(authClient) {
        this.authClient = authClient;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.msRequestTimeout = Number(process.env.MS_REQUEST_TIMEOUT) || 10000;
    }
    async send(pattern, data) {
        this.logger.log(`Sending message to Auth service: ${pattern}`);
        try {
            const result$ = this.authClient.send(pattern, data).pipe((0, rxjs_1.timeout)(this.msRequestTimeout), (0, rxjs_1.catchError)((error) => {
                const getProperty = (obj, prop) => typeof obj === 'object' && obj !== null && prop in obj
                    ? obj[prop]
                    : undefined;
                const getString = (value) => typeof value === 'string' ? value : '';
                const safeError = error instanceof Error
                    ? {
                        name: error.name,
                        message: error.message,
                        stack: getString(getProperty(error, 'stack')),
                        response: (() => {
                            const response = getProperty(error, 'response');
                            return typeof response === 'object' && response !== null
                                ? {
                                    statusCode: getProperty(response, 'statusCode'),
                                    message: getProperty(response, 'message'),
                                    error: getProperty(response, 'error'),
                                }
                                : undefined;
                        })(),
                    }
                    :
                        (() => {
                            try {
                                const parsed = JSON.parse(JSON.stringify(error));
                                return { raw: parsed };
                            }
                            catch {
                                return { raw: util_1.default.inspect(error, { depth: 2 }) };
                            }
                        })();
                this.logger.error(`Microservice error for pattern ${pattern}`, safeError);
                return (0, rxjs_1.throwError)(() => error);
            }));
            const result = await (0, rxjs_1.firstValueFrom)(result$);
            this.logger.log(`Received response from Auth service: ${pattern}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to communicate with Auth service:`, {
                pattern,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw this.mapMsErrorToHttp(error);
        }
    }
    mapMsErrorToHttp(error) {
        if (error instanceof common_1.HttpException)
            return error;
        const getProperty = (obj, prop) => {
            return typeof obj === 'object' && obj !== null && prop in obj
                ? obj[prop]
                : undefined;
        };
        const msResponse = getProperty(error, 'response') ?? error;
        if (this.isMicroserviceError(msResponse)) {
            const statusCode = msResponse.statusCode || msResponse.status || common_1.HttpStatus.BAD_REQUEST;
            const message = msResponse.message || 'Microservice error';
            return new common_1.HttpException({
                statusCode,
                message,
                error: msResponse.error || 'MicroserviceError',
            }, statusCode);
        }
        if (error instanceof Error && error.name === 'TimeoutError') {
            return new common_1.HttpException({
                statusCode: common_1.HttpStatus.GATEWAY_TIMEOUT,
                message: 'Auth service timeout',
                error: 'GatewayTimeout',
            }, common_1.HttpStatus.GATEWAY_TIMEOUT);
        }
        if (error instanceof Error) {
            return new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
                error: 'InternalServerError',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new common_1.HttpException({
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            error: 'UnknownError',
        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    isMicroserviceError(error) {
        return (typeof error === 'object' &&
            error !== null &&
            ('statusCode' in error || 'status' in error || 'message' in error));
    }
    async onModuleInit() {
        try {
            await this.authClient.connect();
            this.logger.log('Successfully connected to Auth microservice via RabbitMQ');
        }
        catch (error) {
            this.logger.error('Failed to connect to Auth microservice:', error);
        }
    }
    async onModuleDestroy() {
        try {
            await this.authClient.close();
            this.logger.log('Closed connection to Auth microservice');
        }
        catch (error) {
            this.logger.error('Error closing Auth microservice connection:', error);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(rabbitmq_constants_1.SERVICES.AUTH)),
    __metadata("design:paramtypes", [Function])
], AuthService);
//# sourceMappingURL=auth.service.js.map