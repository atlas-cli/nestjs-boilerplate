import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { ApplicationProps } from '../../props/application.props';
import { createName } from '../../utils/create-name';

export class LambdaRole extends Construct {
  role: iam.Role;
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id);

    // create iam role
    const ROLE_NAME = createName('role', props);
    this.role = new iam.Role(this, ROLE_NAME, {
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
