import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { ApplicationProps } from '../../props/application.props';

export class LambdaRole extends Construct {
  role: iam.Role;
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id);
    const { createNameCustom, stageName, applicationName } = props;
    const createName: any =
      createNameCustom !== undefined
        ? createNameCustom(stageName, applicationName)
        : (name: string) => `${stageName}-${applicationName}-lambda-${name}`;
    this.role = new iam.Role(this, createName('role'), {
      assumedBy: new iam.AnyPrincipal(),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaVPCAccessExecutionRole',
        ),
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
      ],
    });
  }
}
