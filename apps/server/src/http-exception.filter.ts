import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

interface ErrorResponse {
  message: string[];
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    let responseBody: { errors: string[] };
    let httpStatus: number;
    const userEmail = request.user?.email || request.body?.username || '';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const message = (exception.getResponse() as ErrorResponse).message;
      responseBody = {
        errors: typeof message === 'string' ? [message] : message,
      };

      this.logger.log(`[${userEmail}] ${exception.message}`);
    } else {
      this.logger.error(`[${userEmail}] ${exception}`);

      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        errors: ['internal server error'],
      };
    }

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
