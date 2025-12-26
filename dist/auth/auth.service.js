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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const util_1 = require("util");
const services_constants_1 = require("../common/constants/services.constants");
let AuthService = AuthService_1 = class AuthService {
    constructor(authClient) {
        this.authClient = authClient;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.msRequestTimeout = Number(process.env.MS_REQUEST_TIMEOUT) || 5000;
    }
    async send(pattern, data) {
        try {
            const result$ = this.authClient
                .send(pattern, data)
                .pipe((0, operators_1.timeout)(this.msRequestTimeout));
            return await (0, rxjs_1.firstValueFrom)(result$);
        }
        catch (err) {
            this.logger.error('Auth microservice error', (0, util_1.inspect)(err, { depth: null }));
            throw this.mapMsErrorToHttp(err);
        }
    }
    mapMsErrorToHttp(error) {
        if (error instanceof common_1.HttpException)
            return error;
        if (error instanceof rxjs_1.TimeoutError) {
            return new common_1.HttpException('Upstream service timeout', common_1.HttpStatus.GATEWAY_TIMEOUT);
        }
        if (typeof error === 'object' && error !== null) {
            const e = error;
            const message = typeof e.message === 'string' ? e.message : JSON.stringify(e);
            const statusCode = Number(e.statusCode ?? e.status) || common_1.HttpStatus.BAD_REQUEST;
            return new common_1.HttpException(message, statusCode);
        }
        return new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(services_constants_1.SERVICES.AUTH)),
    __metadata("design:paramtypes", [Function])
], AuthService);
//# sourceMappingURL=auth.service.js.map