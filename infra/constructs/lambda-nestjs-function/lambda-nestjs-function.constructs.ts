import * as iam from 'aws-cdk-lib/aws-iam';
import { Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { createName } from '../../utils/create-name';
import {
  DEFAULT_NESTJS_FUNCTION_PROPS,
  DEFAULT_NESTJS_LAMBDA_ENVIRONMENT,
  NESTJS_SWAGGER_MODULES,
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

    // app path
    const APP_PATH = props.appPath?.length
      ? props.appPath
      : [moduleName, 'server.js'];

    let environment = {
      ...DEFAULT_NESTJS_LAMBDA_ENVIRONMENT[props.stageName],
    };

    environment = {
      ...environment,
      ...createDatabaseAuroraEnvironment(AURORA_DATABASE_NAME),
    };

    const functionProps = {
      ...props,
      ...DEFAULT_NESTJS_FUNCTION_PROPS,
      environment,
      tracing: Tracing.ACTIVE,
      entry: join(__dirname, '..', '..', '..', 'app', ...APP_PATH),
      functionName: NESTJS_FUNCTION_NAME,
    };

    if (functionProps.swaggerBundling) {
      console.log('!!!!!!!!!!!!!!!11');
      functionProps.bundling.nodeModules = NESTJS_SWAGGER_MODULES;
    }

    this.nodejsFunction = new NodejsFunction(
      this,
      NESTJS_FUNCTION_NAME,
      functionProps,
    );
  }
}
