import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from '~/common/filters/all-exceptions.filter.js';
import { corsOptions, validationPipeOptions } from '~/common/configs/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust reverse proxy (Render, Vercel, Cloudflare)
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Middlewares
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(morgan('dev'));
  app.use(cookieParser());

  // Global filters & pipes
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  // Global routing & CORS
  app.setGlobalPrefix('api');
  app.enableCors(corsOptions);

  const port = process.env.PORT ?? 8081;
  await app.listen(port);
  console.log(`🚀 NestJS Application is running on: http://localhost:${port}/api`);
}
await bootstrap();
