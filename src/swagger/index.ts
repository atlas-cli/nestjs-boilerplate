import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = app.get(ConfigService);
  const options = new DocumentBuilder()
    .setTitle(config.get('app.name'))
    .setDescription(`API Documentation for ${config.get('app.name')}`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger/docs', app, document);
};
