import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { createName } from '../../utils/create-name';
import {
  DEFAULT_NESTJS_LAMBDA_ENVIRONMENT,
  DEFAULT_NESTJS_FUNCTION_PROPS,
  createDatabaseAuroraEnvironment,
} from './constants';
import { LambdaNestJsFunctionProps } from './props/lambda-nestjs-function.props';

export class LambdaNestJsFunction extends Construct {
  role: iam.Role;
  nodejsFunction: NodejsFunction;
  constructor(scope: Construct, id: string, props: LambdaNestJsFunctionProps) {
    super(scope, id);

    // build database name
    const AURORA_DATABASE_NAME = createName('aurora-database', props);
    const { functionName, moduleName } = props;

    // create database function
    const NESTJS_FUNCTION_NAME = createName(functionName, props);

    const functionProps = {
      ...props,
      ...DEFAULT_NESTJS_FUNCTION_PROPS,
      environment: {
        ...DEFAULT_NESTJS_LAMBDA_ENVIRONMENT,
        ...createDatabaseAuroraEnvironment(AURORA_DATABASE_NAME),
      },
      entry: join(__dirname, '..', '..', '..', 'app', moduleName, 'server.js'),
      functionName: NESTJS_FUNCTION_NAME,
    };
    this.nodejsFunction = new NodejsFunction(
      this,
      NESTJS_FUNCTION_NAME,
      functionProps,
    );
  }
}
