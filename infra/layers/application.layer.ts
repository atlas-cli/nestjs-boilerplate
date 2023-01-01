import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationProps } from '../props/application.props';
import { LambdaStack } from '../stacks/lambda.stack';

export class ApplicationLayerStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id);

    // create name function
    const createName = (name) =>
      `${applicationProps.applicationName}-${applicationProps.stageName}-${name}`;

    // nested stacks
    new LambdaStack(this, createName('lambda'), applicationProps);
  }
}
