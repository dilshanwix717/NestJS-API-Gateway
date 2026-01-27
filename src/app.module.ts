// apps/api-gateway/src/app.module.ts
// ====================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserController } from './user/user.controller';
import { UserProfileController } from './user/user-profile.controller';
import { QUEUES, SERVICES } from 'libs/common/src/constants/rabbitmq.constants';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // RabbitMQ Client Configuration
    ClientsModule.register([
      {
        name: SERVICES.AUTH,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: QUEUES.AUTH_QUEUE,
          queueOptions: {
            durable: false,
          },
          // Connection timeout
          socketOptions: {
            heartbeatIntervalInSeconds: 60,
            reconnectTimeInSeconds: 5,
          },
        },
      },
      {
        name: SERVICES.USER,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: QUEUES.USER_QUEUE,
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
    AppController,
    AuthController,
    UserController,
    UserProfileController,
  ],
  providers: [AppService, AuthService],
})
export class AppModule {}
