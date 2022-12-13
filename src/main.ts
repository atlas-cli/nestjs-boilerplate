import "reflect-metadata";

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('app.port'));
  console.log('Running in: http://localhost:' + configService.get('app.port'));
}
void bootstrap();
