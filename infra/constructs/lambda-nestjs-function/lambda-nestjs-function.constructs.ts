import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import {
  DEFAULT_NESTJS_LAMBDA_ENVIRONMENT,
  DEFAULT_NESTJS_FUNCTION_PROPS,
} from './constants';
import { createDatabaseAuroraEnvironment } from './constants';
import { LambdaNestJsFunctionProps } from './props/lambda-nestjs-function.props';

export class LambdaNestJsFunction extends Construct {
  role: iam.Role;
  nodejsFunction: NodejsFunction;
  constructor(scope: Construct, id: string, props: LambdaNestJsFunctionProps) {
    super(scope, id);
    const {
      createNameCustom,
      stageName,
      applicationName,
      functionName,
      moduleName,
    } = props;
    const createName: any =
      createNameCustom !== undefined
        ? createNameCustom(stageName, applicationName)
        : (name: string) =>
            `${stageName}-${applicationName}-lambda-nestjs-${name}`;

    const functionProps = {
      functionName: createName(functionName),
      ...DEFAULT_NESTJS_FUNCTION_PROPS,
      environment: {
        ...DEFAULT_NESTJS_LAMBDA_ENVIRONMENT,
        ...createDatabaseAuroraEnvironment(functionName),
      },
      entry: join(__dirname, '..', '..', '..', 'app', moduleName, 'server.js'),
      ...props,
    };
    this.nodejsFunction = new NodejsFunction(
      this,
      createName(functionName),
      functionProps,
    );
  }
}
