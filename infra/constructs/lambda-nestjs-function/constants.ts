import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';

// Import ignore packages NODE_EXTERNALS
export const DEFAULT_NESTJS_NODE_EXTERNALS = [
  'kafkajs',
  'mqtt',
  'amqplib',
  'amqp-connection-manager',
  'ioredis',
  'redis',
  'nats',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  '@nestjs/websockets/socket-module',
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  'class-transformer/storage',
  'pg-native',
  'hbs',
  'nestjs-redoc',
  'cache-manager',
  'fsevents',
  'fastify-swagger',
  'swagger-ui-express',
  'typescript',
  '@nestjs/cli',
];

export const NESTJS_SWAGGER_MODULES = ['oidc-provider', 'swagger-ui-express', '@nestjs/swagger', '@babel/plugin-proposal-export-namespace-from', '@babel/plugin-transform-modules-commonjs'];
export const DEFAULT_NESTJS_NODE_MODULE = ['oidc-provider', '@babel/plugin-proposal-export-namespace-from', '@babel/plugin-transform-modules-commonjs'];

export const DEFAULT_NESTJS_COMMAND_HOOKS = {
  beforeBundling: (inputDir: string, outputDir: string): string[] => {
    return [
      `mkdir ${outputDir}/cert`,
      `cp -R ${inputDir}/src/common/config/certs/rds-combined-ca-bundle.pem ${outputDir}/cert`,
      `mkdir ${outputDir}/templates`,
      //`cp -R ${inputDir}/src/common/mail/templates/* ${outputDir}/templates`,
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
  runtime: Runtime.NODEJS_20_X,
  allowPublicSubnet: true,
  bundling: {
    minify: true,
    keepNames: true,
    sourcemap: true,
    zip: true,
    externalModules: DEFAULT_NESTJS_NODE_EXTERNALS,
    nodeModules: DEFAULT_NESTJS_NODE_MODULE,
    commandHooks: DEFAULT_NESTJS_COMMAND_HOOKS,
  },
};

export const DEFAULT_NESTJS_LAMBDA_ENVIRONMENT = {
  production: {
    NODE_ENV: 'production',
    APP_PORT: '3000',
    APP_NAME: 'NestJS Boilerplate',
    APP_FALLBACK_LANGUAGE: 'en',
    APP_HEADER_LANGUAGE: 'x-custom-lang',

    FRONTEND_DOMAIN: 'https://localhost:4200',
    BACKEND_DOMAIN: 'https://api.yourdomain.com',
    SWAGGER_ENABLED: 'true',
    I18N_DIRECTORY: 'i18n',
    AUTH_JWT_SECRET: 'put-your-secret-here',
    AUTH_JWT_TOKEN_EXPIRES_IN: '1d',

    SESSIONS_TABLE_NAME: 'atlas-production-sessions',

    MAIL_TEMPLATES_PATH: 'templates',
    MAIL_FROM: 'info@yourdomain.com.br',

    AWS_STORAGE_CREDENTIAL: 'profile',
    AWS_STORAGE_REGION: 'us-east-1',
  },
  development: {
    // App
    NODE_ENV: 'development',
    APP_PORT: '3000',
    APP_NAME: 'NestJS Boilerplate',
    APP_FALLBACK_LANGUAGE: 'en',
    APP_HEADER_LANGUAGE: 'x-custom-lang',

    FRONTEND_DOMAIN: 'https://localhost:4200',
    BACKEND_DOMAIN: 'https://api.yourdomain.com',
    SWAGGER_ENABLED: 'true',
    I18N_DIRECTORY: 'i18n',
    AUTH_JWT_SECRET: 'put-your-secret-here',
    AUTH_JWT_TOKEN_EXPIRES_IN: '1d',

    SESSIONS_TABLE_NAME: 'atlas-development-sessions',

    MAIL_TEMPLATES_PATH: 'templates',
    MAIL_FROM: 'info@yourdomain.com.br',

    AWS_STORAGE_CREDENTIAL: 'profile',
    AWS_STORAGE_REGION: 'us-east-1',
  }
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
