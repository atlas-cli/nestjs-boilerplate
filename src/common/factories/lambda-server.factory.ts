import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
import commonBootstrap from './../bootstrap';
import { setupSwagger } from './../../swagger';
import { ConfigService } from '@nestjs/config';

let cachedApplicationStandalone: Server;
const binaryMimeTypes: string[] = [];

/**
 * LambdaServerFactory class is responsible for setting up the AWS Lambda server.
 */
export class LambdaServerFactory {
  /**
   * Creates a new AWS Lambda server.
   * @param module - The module to start the server with.
   * @returns The handler for the new server.
   */
  public static create(module: any): Handler {
    return async (event: any, context: Context) => {
      cachedApplicationStandalone = await this.buildApplicationProxy(module);
      return proxy(cachedApplicationStandalone, event, context, 'PROMISE')
        .promise;
    };
  }

  /**
   * Builds the application proxy for the AWS Lambda server.
   * @param module - The module to start the server with.
   * @returns The server for the application proxy.
   */
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
          bodyParser: true,
          cors: true,
        },
      );

      const configService = nestApplication.get(ConfigService);

      // Enable Swagger documentation if it's enabled in the configuration.
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
