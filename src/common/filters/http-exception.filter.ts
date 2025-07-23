import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseResponseDto } from '../dto/base-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    let message = exception.message;

    // Handle validation errors
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      if (responseObj.message && Array.isArray(responseObj.message)) {
        message = responseObj.message.join(', ');
      } else if (responseObj.message) {
        message = responseObj.message;
      }
    }

    this.logger.warn(
      `HTTP Exception: ${status} - ${message} - ${request.method} ${request.url}`,
    );

    response.status(status).json(new BaseResponseDto(false, null, message));
  }
}
