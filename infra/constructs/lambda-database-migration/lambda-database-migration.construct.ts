import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import {
  DEFAULT_NESTJS_LAMBDA_ENVIRONMENT,
  DEFAULT_NESTJS_FUNCTION_PROPS,
  createDatabaseAuroraEnvironment,
} from '../lambda-nestjs-function/constants';
import { LambdaDatabaseMigrationProps } from './props/lambda-database-migration.prop';

export class LambdaDatabaseMigration extends Construct {
  role: iam.Role;
  nodejsFunction: NodejsFunction;
  constructor(
    scope: Construct,
    id: string,
    props: LambdaDatabaseMigrationProps,
  ) {
    super(scope, id);
    const { createNameCustom, stageName, applicationName } = props;
    const databaseName = `${stageName}-${applicationName}-aurora-database`;
    const createName: any =
      createNameCustom !== undefined
        ? createNameCustom(stageName, applicationName)
        : (name: string) =>
            `${stageName}-${applicationName}-lambda-database-${name}`;

    const functionProps = {
      ...props,
      ...DEFAULT_NESTJS_FUNCTION_PROPS,
      environment: {
        ...DEFAULT_NESTJS_LAMBDA_ENVIRONMENT,
        ...createDatabaseAuroraEnvironment(databaseName),
      },
      bundling: {
        minify: false,
        commandHooks: {
          beforeBundling: (inputDir: string, outputDir: string): string[] => {
            return [
              `cp -R ${inputDir}/dist ${outputDir}/dist`,
              `cp ${inputDir}/tsconfig.json ${outputDir}/tsconfig.json`,
              `mkdir ${outputDir}/cert`,
              `cp -R ${inputDir}/src/common/config/certs/rds-ca-2019-root.pem ${outputDir}/cert`,
            ];
          },
          afterBundling: (
            _inputDir: string,
            _outputDir: string,
          ): string[] => [],
          beforeInstall: (
            _inputDir: string,
            _outputDir: string,
          ): string[] => [],
        },
        nodeModules: ['typeorm', 'ts-node', '@nestjs/config', 'pg'],
      },
      entry: join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'node_modules',
        '@atlas-org',
        'database',
        'index.js',
      ),
      functionName: createName('migration'),
    };
    this.nodejsFunction = new NodejsFunction(
      this,
      createName('migration'),
      functionProps,
    );
  }
}
