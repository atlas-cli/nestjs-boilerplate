import * as iam from 'aws-cdk-lib/aws-iam';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { createName } from '../../utils/create-name';
import {
  DEFAULT_NESTJS_FUNCTION_PROPS,
  DEFAULT_NESTJS_LAMBDA_ENVIRONMENT,
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

    // build database name
    const AURORA_DATABASE_NAME = createName('aurora-database', props);

    // create database function
    const DATABASE_MIGRATION_FUNCTION_NAME = createName('migration', props);
    const functionProps: NodejsFunctionProps = {
      ...props,
      ...DEFAULT_NESTJS_FUNCTION_PROPS,
      environment: {
        ...DEFAULT_NESTJS_LAMBDA_ENVIRONMENT[props.stageName],
        ...createDatabaseAuroraEnvironment(AURORA_DATABASE_NAME),
      },
      bundling: {
        minify: false,
        commandHooks: {
          beforeBundling: (inputDir: string, outputDir: string): string[] => {
            return [
              `cp -R ${inputDir}/dist ${outputDir}/dist`,
              `cp ${inputDir}/tsconfig.json ${outputDir}/tsconfig.json`,
              `mkdir ${outputDir}/cert`,
              `cp -R ${inputDir}/src/common/config/certs/rds-combined-ca-bundle.pem ${outputDir}/cert`,
            ];
          },
          afterBundling: (): string[] => [],
          beforeInstall: (): string[] => [],
        },
        nodeModules: ['typeorm', 'ts-node', '@nestjs/config', 'pg', 'bcryptjs'],
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
      functionName: DATABASE_MIGRATION_FUNCTION_NAME,
    };
    this.nodejsFunction = new NodejsFunction(
      this,
      DATABASE_MIGRATION_FUNCTION_NAME,
      functionProps,
    );
  }
}
