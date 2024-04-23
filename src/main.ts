import 'reflect-metadata';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import commonBootstrap from './common/bootstrap';

/**
 * Boots up the application.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable Swagger documentation
  if (configService.get('app.swaggerEnabled') === 'true') {
    setupSwagger(app);
  }

  // Common bootstrap
  commonBootstrap(app, AppModule);

  await app.listen(configService.get('app.port'));
  console.log('Running in: http://localhost:' + configService.get('app.port'));
}
void bootstrap();