import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { AuroraDatabaseProxy } from '../constructs/aurora-database-proxy/aurora-database-proxy.construct';
import { LambdaNestJsFunction } from '../constructs/lambda-nestjs-function/lambda-nestjs-function.constructs';
import { LambdaRole } from '../constructs/lambda-role/lambda-role.construct';
import { LambdaProps } from '../props/lambda.props';
import { createName as defaultCreateName } from '../utils/create-name';

export class LambdaResource extends Construct {
  nodejsFunction: NodejsFunction;
  constructor(scope: Construct, id: string, lambdaProps: LambdaProps) {
    super(scope, id);
    // setup prefix
    const createName = (name, config) =>
      defaultCreateName(`lambda-${lambdaProps.functionName}-${name}`, config);

    const { functionName, moduleName } = lambdaProps;

    const { proxy } = AuroraDatabaseProxy.fromNameAndSecurityGroup(
      this,
      'aurora-database-proxy',
      lambdaProps.genericSecurityGroup.securityGroup,
      lambdaProps,
    );

    // create iam role
    const LAMBDA_ROLE_NAME = createName('role', lambdaProps);
    const { role } = new LambdaRole(this, LAMBDA_ROLE_NAME);

    // grant access to lambda connect in aurora database
    proxy.grantConnect(role, 'postgres');

    // create nodejs function
    const LAMBDA_NESTJS_FUNCTION_NAME = createName('function', lambdaProps);
    const { nodejsFunction } = new LambdaNestJsFunction(
      this,
      LAMBDA_NESTJS_FUNCTION_NAME,
      {
        ...lambdaProps,
        functionName,
        moduleName,
        role,
        vpc: lambdaProps.genericSecurityGroup.vpc,
        securityGroups: [lambdaProps.genericSecurityGroup.securityGroup],
      },
    );

    this.nodejsFunction = nodejsFunction;
  }
}
