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
   * Accepts auth credentials and required profile data. The Auth microservice
   * creates the auth record, then orchestrates user-profile and user-status
   * creation in the User microservice via RabbitMQ.
   *
   * Validation:
   * - username must be a non-empty string
   * - email must be a valid email format
   * - password must be a string with minimum 8 characters
   * - roles (optional) must be an array of strings
   * - profile (required) nested object:
   *   - firstName (required, max 50 chars)
   *   - lastName  (required, max 50 chars)
   *   - dateOfBirth (required, ISO 8601 date string)
   *   - phone (required, max 20 chars)
   *
   * @param body - Signup credentials and profile data
   * @returns AuthSignUpResponseDto with auth identity and profile summary
   * @throws HttpException on validation error, duplicate email, microservice error, or timeout
   */
  @Post('signup')
  signUp(@Body() body: AuthSignUpRequestDto) {
    // Forward to auth microservice with automatic timeout and error handling
    return this.authService.send('auth-signup', body);
  }
}
