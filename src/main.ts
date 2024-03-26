import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from './common/logger/logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn']
  });
  app.useLogger(app.get(Logger))
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3333);
}
bootstrap();
