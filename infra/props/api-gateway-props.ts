import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

export interface ApiGatewayProps {
  /** The name of the REST API. */
  restApiName: string;
  /** The domain name for the API Gateway. */
  domainName: string;
  /** The SSL certificate associated with the domain. */
  certificate: Certificate;
}
