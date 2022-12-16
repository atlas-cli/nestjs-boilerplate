import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { App, Stack } from 'aws-cdk-lib';
import { AuroraDatabaseVpc } from '../constructs/aurora-database-vpc/aurora-database-vpc.construct';
import { AuroraDatabaseProxy } from '../constructs/aurora-database-proxy/aurora-database-proxy.construct';
import { LambdaRole } from '../constructs/lambda-role/lambda-role.construct';
import { LambdaNestJsFunction } from '../constructs/lambda-nestjs-function/lambda-nestjs-function.constructs';
import { ApiGateway } from '../constructs/api-gateway/api-gateway.construct';

export class LambdaServiceStack extends Stack {
  constructor(app: App, id: string, { stage }: any) {
    super(app, id);
    const name = 'lambda-service-' + stage;
    const auroraName = 'aurora-' + stage;

    // import vpc, and rds proxy
    const { vpc, securityGroup } = AuroraDatabaseVpc.fromName(this, auroraName);
    const { proxy } = AuroraDatabaseProxy.fromNameAndSecurityGroup(
      this,
      auroraName,
      securityGroup,
    );

    // create iam role
    const { role } = new LambdaRole(this, 'LambdaRole');

    // grant access to lambda connect in aurora database
    proxy.grantConnect(role, 'postgres');

    // create nodejs function
    const { nodejsFunction } = new LambdaNestJsFunction(
      this,
      'NodeJsFunction',
      {
        functionName: 'users',
        moduleName: 'users',
        vpc,
        securityGroups: [securityGroup],
      },
    );

    // Create an API Gateway resource for each of the CRUD operations
    const { api } = new ApiGateway(this, name + '-api-gateway', {
      restApiName: name + '-api-gateway',
    });

    // Integrate the Lambda functions with the API Gateway resource
    const httpIntegration = new LambdaIntegration(nodejsFunction, {
      proxy: true,
    });

    const items = api.root.addResource('{proxy+}');
    items.addMethod('ANY', httpIntegration);
  }
}
