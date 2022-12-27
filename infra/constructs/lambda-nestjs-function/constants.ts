import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';

// Import ignore packages NODE_EXTERNALS
export const DEFAULT_NESTJS_NODE_EXTERNALS = [
  'aws-sdk',
  'kafkajs',
  'mqtt',
  'amqplib',
  'amqp-connection-manager',
  'nats',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  '@nestjs/websockets/socket-module',
  'class-transformer/storage',
  'pg-native',
  'hbs',
  'nestjs-redoc',
  'cache-manager',
  'fsevents',
  'fastify-swagger',
  'swagger-ui-express',
];

export const DEFAULT_NESTJS_NODE_MODULE = ['@nestjs/microservices', 'pg'];

export const DEFAULT_NESTJS_COMMAND_HOOKS = {
  beforeBundling: (inputDir: string, outputDir: string): string[] => {
    return [
      `mkdir ${outputDir}/cert`,
      `cp -R ${inputDir}/src/common/config/certs/rds-ca-2019-root.pem ${outputDir}/cert`,
      `mkdir ${outputDir}/i18n`,
      `cp -R ${inputDir}/src/i18n ${outputDir}/i18n`,
    ];
  },
  afterBundling: (_inputDir: string, _outputDir: string): string[] => [],
  beforeInstall: (_inputDir: string, _outputDir: string): string[] => [],
};

export const DEFAULT_NESTJS_FUNCTION_PROPS = {
  depsLockFilePath: join(__dirname, '..', '..', '..', '..', 'package-lock.json'),
  memorySize: 2048,
  timeout: Duration.seconds(6),
  runtime: Runtime.NODEJS_16_X,
  allowPublicSubnet: true,
  bundling: {
    minify: false,
    externalModules: DEFAULT_NESTJS_NODE_EXTERNALS,
    nodeModules: DEFAULT_NESTJS_NODE_MODULE,
    commandHooks: DEFAULT_NESTJS_COMMAND_HOOKS,
  },
};

export const DEFAULT_NESTJS_LAMBDA_ENVIRONMENT = {
  NODE_ENV: 'development',
  APP_PORT: '3000',
  APP_NAME: '"NestJS Boilerplate"',
  APP_FALLBACK_LANGUAGE: 'en',
  APP_HEADER_LANGUAGE: 'x-custom-lang',
  AUTH_JWT_SECRET: 'secret',
  AUTH_JWT_TOKEN_EXPIRES_IN: '1d',
};

export const createDatabaseAuroraEnvironment = (name: string) => {
  return {
    DATABASE_TYPE: 'postgres',
    DATABASE_HOST: cdk.Fn.importValue(name + '-proxy-host'),
    DATABASE_USERNAME: 'postgres',
    DATABASE_PORT: '5432',
    DATABASE_NAME: 'postgres',
    DATABASE_REJECT_UNAUTHORIZED: 'true',
    DATABASE_SSL_ENABLED: 'true',
    DATABASE_SYNCHRONIZE: 'false',
  };
};
