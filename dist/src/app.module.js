"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_1 = require("./auth/auth.service");
const user_controller_1 = require("./user/user.controller");
const user_profile_controller_1 = require("./user/user-profile.controller");
const rabbitmq_constants_1 = require("../libs/common/src/constants/rabbitmq.constants");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            microservices_1.ClientsModule.register([
                {
                    name: rabbitmq_constants_1.SERVICES.AUTH,
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL],
                        queue: rabbitmq_constants_1.QUEUES.AUTH_QUEUE,
                        queueOptions: {
                            durable: false,
                        },
                        socketOptions: {
                            heartbeatIntervalInSeconds: 60,
                            reconnectTimeInSeconds: 5,
                        },
                    },
                },
                {
                    name: rabbitmq_constants_1.SERVICES.USER,
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                        queue: rabbitmq_constants_1.QUEUES.USER_QUEUE,
                        queueOptions: {
                            durable: true,
                        },
                        socketOptions: {
                            heartbeatIntervalInSeconds: 60,
                            reconnectTimeInSeconds: 5,
                        },
                    },
                },
            ]),
        ],
        controllers: [
            app_controller_1.AppController,
            auth_controller_1.AuthController,
            user_controller_1.UserController,
            user_profile_controller_1.UserProfileController,
        ],
        providers: [app_service_1.AppService, auth_service_1.AuthService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map