// apps/api-gateway/src/auth/auth.controller.ts
// ==============================================

import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { AuthLoginRequestDto } from '@/lib/dto/auth-login.dto';
import { AuthSignUpRequestDto } from '@/lib/dto/auth-signup.dto';
import { AuthService } from './auth.service';
import { MESSAGE_PATTERNS } from 'libs/common/src/constants/rabbitmq.constants';
import type { AuthLoginResponseDto } from '@/lib/dto/auth-login-response.dto';
import type { AuthSignUpResponseDto } from '@/lib/dto/auth-signup-response.dto';

/**
 * Auth Controller - HTTP endpoints for authentication
 */
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/signup
   * Handles user registration
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() body: AuthSignUpRequestDto,
  ): Promise<AuthSignUpResponseDto> {
    this.logger.log('Signup request received', {
      username: body.username,
      email: body.email,
    });

    return this.authService.send<AuthSignUpRequestDto, AuthSignUpResponseDto>(
      MESSAGE_PATTERNS.AUTH_SIGNUP,
      body,
    );
  }

  /**
   * POST /api/auth/login
   * Handles user login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: AuthLoginRequestDto,
  ): Promise<AuthLoginResponseDto> {
    this.logger.log('Login request received', {
      email: body.email,
    });

    return this.authService.send<AuthLoginRequestDto, AuthLoginResponseDto>(
      MESSAGE_PATTERNS.AUTH_LOGIN,
      body,
    );
  }
}
