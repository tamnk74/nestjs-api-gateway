import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';

import { ApiException } from './api.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private config: ConfigService) {}
  catch(exception: HttpException | ApiException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    if (exception instanceof ApiException) {
      response.status(exception.getStatus()).send(exception.toJSON());
      return;
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      response.status(status).send({
        status,
        code: `ERR-${status}`,
        message: (<{ message: string }>res).message || res || exception.message,
        stack: !['staging', 'production'].includes(
          this.config.get('NODE_ENV') as string,
        )
          ? exception.stack
          : undefined,
      });
      return;
    }
    console.error(exception);

    response.status(500).send(
      new ApiException({
        status: 500,
        code: 'ERR-500',
        message: (<Error>exception).message,
        stack: !['staging', 'production'].includes(
          this.config.get('NODE_ENV') as string,
        )
          ? (<Error>exception).stack
          : undefined,
      }),
    );
  }
}
