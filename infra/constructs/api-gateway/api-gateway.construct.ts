import { Construct } from 'constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayProps } from './props/api-gateway.props';
import { createName } from '../../utils/create-name';

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
    });
  }
}
