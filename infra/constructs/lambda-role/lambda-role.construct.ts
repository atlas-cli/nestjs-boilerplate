import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';

export class LambdaRole extends Construct {
  role: iam.Role;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.role = new iam.Role(this, 'LambdaRole', {
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
