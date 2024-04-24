import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApplicationProps } from '../../../props/application.props';

export interface ApiGatewayProps extends ApplicationProps {
  restApiName: string;
  domainName: string;
  certificate: Certificate;
}
