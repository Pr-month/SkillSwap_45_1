import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof EntityNotFoundError) {
      return response.status(404).json({
        statusCode: 404,
        message: 'Entity not found',
      });
    }

    if (exception instanceof PayloadTooLargeException) {
      return response.status(413).json({
        statusCode: 413,
        message: 'Payload too large',
      });
    }

    if (exception instanceof QueryFailedError) {
      const error = exception as QueryFailedError & {
        code?: string;
        detail?: string;
        driverError?: {
          code?: string;
          detail?: string;
        };
      };

      if (error.code === '23505') {
        return response.status(409).json({
          statusCode: 409,
          message: 'Dublicate entry',
        });
      }
    }

    response.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}
