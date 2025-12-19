// apps/api-gateway/src/app/auth/auth.controller.ts
import { Body, Controller, Inject, Post } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import type { AuthLoginRequestDto } from '@/lib/dto/auth-login.dto';
import type { AuthLoginResponseDto } from '@/lib/dto/auth-login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH-SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  async login(
    @Body() body: AuthLoginRequestDto,
  ): Promise<AuthLoginResponseDto> {
    const result$ = this.authClient.send<
      AuthLoginResponseDto,
      AuthLoginRequestDto
    >('auth-login', body);

    return firstValueFrom(result$);
  }
}
