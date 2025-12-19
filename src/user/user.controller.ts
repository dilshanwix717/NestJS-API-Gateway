// apps/api-gateway/src/app/user/user.controller.ts
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../guards/auth/auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { JwtPayload } from '../lib/auth/jwt-payload';
import type { UserDto } from '../lib/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER-SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserProfile(@GetUser() user: JwtPayload): Promise<UserDto> {
    const user$ = this.userClient.send<UserDto, string>(
      'get-user-profile',
      user.userId,
    );

    return firstValueFrom(user$);
  }
}
