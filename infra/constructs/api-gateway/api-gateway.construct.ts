import { Construct } from 'constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayProps } from './props/api-gateway.props';

export class ApiGateway extends Construct {
  api: RestApi;
  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);
    const { createNameCustom, stageName, applicationName, restApiName } = props;
    const createName: any =
      createNameCustom !== undefined
        ? createNameCustom(stageName, applicationName)
        : (name: string) => `${stageName}-${applicationName}-lambda-${name}`;

    super(scope, id);
    this.api = new RestApi(this, createName(restApiName), {
      restApiName: createName(restApiName),
    });
  }
}
