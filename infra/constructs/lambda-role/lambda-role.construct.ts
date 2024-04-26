import * as iam from 'aws-cdk-lib/aws-iam';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class LambdaRole extends Construct {
  role: iam.Role;
  constructor(scope: Construct, name: string) {
    super(scope, name);
    this.role = new iam.Role(this, name, {
      roleName: name,
      assumedBy: new iam.AnyPrincipal(),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaVPCAccessExecutionRole',
        ),
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
        ManagedPolicy.fromAwsManagedPolicyName('SecretsManagerReadWrite'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSESFullAccess'),
      ],
    });
  }
}
