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
  'ioredis',
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

export const DEFAULT_NESTJS_NODE_MODULE = [];

export const DEFAULT_NESTJS_COMMAND_HOOKS = {
  beforeBundling: (inputDir: string, outputDir: string): string[] => {
    return [
      `mkdir ${outputDir}/cert`,
      `cp -R ${inputDir}/src/common/config/certs/rds-combined-ca-bundle.pem ${outputDir}/cert`,
      `mkdir ${outputDir}/i18n`,
      `cp -R ${inputDir}/src/i18n/* ${outputDir}/i18n`,
    ];
  },
  afterBundling: (): string[] => [],
  beforeInstall: (): string[] => [],
};

export const DEFAULT_NESTJS_FUNCTION_PROPS = {
  depsLockFilePath: join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'package-lock.json',
  ),
  memorySize: 2048,
  timeout: Duration.seconds(6),
  runtime: Runtime.NODEJS_16_X,
  allowPublicSubnet: true,
  bundling: {
    minify: true,
    keepNames: true,
    externalModules: DEFAULT_NESTJS_NODE_EXTERNALS,
    nodeModules: DEFAULT_NESTJS_NODE_MODULE,
    commandHooks: DEFAULT_NESTJS_COMMAND_HOOKS,
  },
};

export const DEFAULT_NESTJS_LAMBDA_ENVIRONMENT = {
  // App
  NODE_ENV: 'development',
  APP_PORT: '3000',
  APP_NAME: '"NestJS Boilerplate"',
  APP_FALLBACK_LANGUAGE: 'en',
  APP_HEADER_LANGUAGE: 'x-custom-lang',
  FRONTEND_DOMAIN: 'http://localhost:4200',
  BACKEND_DOMAIN: 'http://localhost:3000',
  SWAGGER_ENABLED: 'true',
  I18N_DIRECTORY: 'i18n',

  // Auth
  AUTH_JWT_SECRET: 'secret',
  AUTH_JWT_TOKEN_EXPIRES_IN: '1d',

  // Stripe
  STRIPE_API_KEY:
    'sk_test_51Mz0jRDyelItnPcTNvLPThUfxsWSEbSX7wveeFG0vzfDmnOxXwLz67DYx87OSHom4Ek3DvYVXgYbeg1CRrvW1vTa00RrWCsdD7',
  STRIPE_DEVICE_NAME: 'local',
  STRIPE_ACCOUNT_SECRET: 'whsec_bCaCf5CHNEiGIegKkduFkVIdLn7QvKSS',
  STRIPE_CONNECT_SECRET: 'whsec_bCaCf5CHNEiGIegKkduFkVIdLn7QvKSS',
};

export const createDatabaseEnvironment = (name: string) => {
  return {
    DATABASE_SECRET_NAME: cdk.Fn.importValue(name + '-secret-name'),
    DATABASE_TYPE: 'mongodb',
  };
};
