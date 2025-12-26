// apps/api-gateway/src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | object;
  debug?: {
    exception: unknown;
    stack?: string;
  };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();

    const response = httpContext.getResponse<Response>();
    const request = httpContext.getRequest<Request>();

    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: string | object =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // 🔍 LOG FULL ERROR (SAFE)
    const safeBody: unknown =
      typeof request.body === 'object' ? request.body : undefined;

    this.logger.error('Exception caught', {
      path: request.url,
      method: request.method,
      body: safeBody,
      exception,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    const responseBody: ErrorResponseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof Error ? exception.message : message,
    };

    if (process.env.NODE_ENV !== 'production') {
      responseBody.debug = {
        exception,
        stack: exception instanceof Error ? exception.stack : undefined,
      };
    }

    response.status(status).json(responseBody);
  }
}
