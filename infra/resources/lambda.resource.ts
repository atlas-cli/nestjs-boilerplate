import { Construct } from 'constructs';
import { LambdaRole } from '../constructs/lambda-role/lambda-role.construct';
import { LambdaNestJsFunction } from '../constructs/lambda-nestjs-function/lambda-nestjs-function.construct';
import { createName as defaultCreateName } from '../utils/create-name';
import { DocumentDBSecurityGroup } from '../constructs/documentdb-security-group/documentdb-security-group.construct';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaProps } from '../props/lambda.props';

export class LambdaResource extends Construct {
  nodejsFunction: NodejsFunction;
  constructor(scope: Construct, id: string, lambdaProps: LambdaProps) {
    super(scope, id);
    // setup prefix
    const createName = (name, config) =>
      defaultCreateName(`lambda-${lambdaProps.functionName}-${name}`, config);

    // import vpc and security group
    const { vpc, securityGroup } = DocumentDBSecurityGroup.fromName(
      this,
      'security-group',
      lambdaProps,
    );

    // create iam role
    const LAMBDA_ROLE_NAME = createName('role', lambdaProps);
    const { role } = new LambdaRole(this, LAMBDA_ROLE_NAME);

    // create nodejs function
    const LAMBDA_NESTJS_FUNCTION_NAME = createName('function', lambdaProps);
    const { nodejsFunction } = new LambdaNestJsFunction(
      this,
      LAMBDA_NESTJS_FUNCTION_NAME,
      {
        ...lambdaProps,
        functionName: lambdaProps.functionName,
        moduleName: lambdaProps.moduleName,
        role,
        vpc,
        vpcSubnets: vpc.selectSubnets({
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        }),
        securityGroups: [securityGroup],
      },
    );
    this.nodejsFunction = nodejsFunction;
  }
}
