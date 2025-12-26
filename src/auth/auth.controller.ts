// apps/api-gateway/src/app/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginRequestDto } from '@/lib/dto/auth-login.dto';
import { AuthSignUpRequestDto } from '@/lib/dto/auth-signup.dto';
import { AuthService } from './auth.service';

/**
 * AuthController - REST API endpoints for authentication
 *
 * Routes:
 * - POST /api/auth/login    - User login endpoint
 * - POST /api/auth/signup   - User registration endpoint
 *
 * All endpoints delegate to AuthService which handles microservice communication,
 * timeout protection, and error mapping. Request validation is performed by
 * NestJS pipes using DTOs (class-validator decorators).
 */
@Controller('auth')
export class AuthController {
  // AuthService handles all auth microservice communication
  constructor(private readonly authService: AuthService) {}

  /**
   * User login endpoint
   *
   * Validation:
   * - Email must be a valid email format (via @IsEmail())
   * - Password must be a string with minimum 6 characters
   *
   * @param body - Login credentials (email, password)
   * @returns AuthLoginResponseDto with JWT token and user details
   * @throws HttpException on validation error, microservice error, or timeout
   */
  @Post('login')
  login(@Body() body: AuthLoginRequestDto) {
    // Forward to auth microservice with automatic timeout and error handling
    return this.authService.send('auth-login', body);
  }

  /**
   * User signup (registration) endpoint
   *
   * Validation:
   * - Email must be a valid email format
   * - Password must be a string with minimum 6 characters
   * - Other fields depend on AuthSignUpRequestDto schema
   *
   * @param body - Signup credentials (email, password, etc.)
   * @returns AuthSignUpResponseDto with user details (tokens may be included)
   * @throws HttpException on validation error, duplicate email, microservice error, or timeout
   */
  @Post('signup')
  signUp(@Body() body: AuthSignUpRequestDto) {
    // Forward to auth microservice with automatic timeout and error handling
    return this.authService.send('auth-signup', body);
  }
}
