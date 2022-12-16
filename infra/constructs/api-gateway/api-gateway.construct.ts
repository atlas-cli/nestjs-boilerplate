import { Construct } from 'constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayProps } from './props/api-gateway.props';

export class ApiGateway extends Construct {
  api: RestApi;
  constructor(scope: Construct, id: string, { restApiName }: ApiGatewayProps) {
    super(scope, id);
    this.api = new RestApi(this, restApiName + '-api-gateway', {
      restApiName: restApiName + '-api-gateway',
    });
  }
}
