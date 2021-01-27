import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || config.get('server.port');
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: config.get('server.origin') });
    logger.log(`Accept request from origin "${config.get('server.origin')}"`);
  }
  await app.listen(port);
  logger.log(`Application starts on port ${port}`);
}
bootstrap();
