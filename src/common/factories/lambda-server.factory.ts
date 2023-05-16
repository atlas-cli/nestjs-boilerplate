import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AtlasFactory } from '@atlas-org/microservices';
import commonBootstrap from 'common/bootstrap';
import { setupSwagger } from 'swagger';
import { ConfigService } from '@nestjs/config';

let cachedApplicationStandalone: Server;
const binaryMimeTypes: string[] = [];

export class LambdaServerFactory extends AtlasFactory {
  public static create(module: any): Handler {
    return async (event: any, context: Context) => {
      cachedApplicationStandalone = await this.buildApplicationProxy(module);
      return proxy(cachedApplicationStandalone, event, context, 'PROMISE')
        .promise;
    };
  }
  static async buildApplicationProxy(module: any): Promise<Server> {
    if (!cachedApplicationStandalone) {
      const expressApplication = express();
      expressApplication.use(
        express.json({
          verify: (req: any, res, buffer) => {
            req.rawBody = buffer.toString();
          },
        }),
      );
      const nestApplication = await NestFactory.create(
        module,
        new ExpressAdapter(expressApplication),
        {
          rawBody: true,
        },
      );

      const configService = nestApplication.get(ConfigService);

      // enable swagger documentation
      if (configService.get('app.swaggerEnabled') === 'true') {
        setupSwagger(nestApplication);
      }

      nestApplication.use(eventContext());
      commonBootstrap(nestApplication, module);
      await nestApplication.init();
      cachedApplicationStandalone = createServer(
        expressApplication,
        undefined,
        binaryMimeTypes,
      );
    }
    return cachedApplicationStandalone;
  }
}
