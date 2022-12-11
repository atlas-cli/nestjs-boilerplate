import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { UsersServerModule } from './server.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersServerModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('app.port'));
  console.log('Running in: http://localhost:' + configService.get('app.port'));
}
void bootstrap();
