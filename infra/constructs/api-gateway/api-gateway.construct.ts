import { Cors, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { createName } from '../../utils/create-name';
import { ApiGatewayProps } from './props/api-gateway.props';

export class ApiGateway extends Construct {
  api: RestApi;
  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    // get resetApiName
    const { restApiName } = props;

    // create a restApi name
    const REST_API_NAME = createName(restApiName, props);

    this.api = new RestApi(this, REST_API_NAME, {
      restApiName: REST_API_NAME,
      domainName: {
        domainName: props.domainName,
        certificate: props.certificate,
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });
  }
}
