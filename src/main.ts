/* istanbul ignore file */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from 'fastify-compress';
import { fastifyHelmet } from 'fastify-helmet';
import { AllExceptionFilter } from 'src/exceptions';
import { WinstonLogger } from 'src/common/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: { target: false },
    }),
  );

  await app.register(fastifyHelmet);
  // Only use gzip because brotli is quite slow, needs more performance benchmark
  await app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.useLogger(app.get(WinstonLogger));
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configService = app.get(ConfigService);
  app.useGlobalFilters(new AllExceptionFilter(configService));
  await app.listen(configService.get<string>('PORT', '3000'), '0.0.0.0');
}
bootstrap();
