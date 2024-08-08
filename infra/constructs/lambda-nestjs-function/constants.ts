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
  '@babel',
];

export const NESTJS_SWAGGER_MODULES = [
  'oidc-provider',
  'swagger-ui-express',
  '@nestjs/swagger',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-transform-modules-commonjs',
];
export const DEFAULT_NESTJS_NODE_MODULE = [
  'oidc-provider',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-transform-modules-commonjs',
];

export const DEFAULT_NESTJS_COMMAND_HOOKS = {
  beforeBundling: (inputDir: string, outputDir: string): string[] => {
    return [
      `pwd ${inputDir}`,
      `mkdir ${outputDir}/certs`,
      `cp -R ${inputDir}/src/common/config/certs/rds-combined-ca-bundle.pem ${outputDir}/certs`,
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
  depsLockFilePath: join(__dirname, '..', '..', '..', 'package-lock.json'),
  memorySize: 2048,
  timeout: Duration.seconds(6),
  runtime: Runtime.NODEJS_20_X,
  allowPublicSubnet: true,
  bundling: {
    minify: true,
    keepNames: true,
    sourcemap: false,
    zip: true,
    externalModules: DEFAULT_NESTJS_NODE_EXTERNALS,
    nodeModules: DEFAULT_NESTJS_NODE_MODULE,
    commandHooks: DEFAULT_NESTJS_COMMAND_HOOKS,
  },
};
