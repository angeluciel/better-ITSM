import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  });

  const port = parseInt(process.env.API_PORT ?? '4000', 10);
  const host = process.env.API_HOST ?? '0.0.0.0';

  await app.listen(port, host);
}

bootstrap();
