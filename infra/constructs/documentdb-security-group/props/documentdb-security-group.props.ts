import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationProps } from '../../../props/application.props';

export interface DocumentDBSecurityGroupProps extends ApplicationProps {
  vpc: IVpc;
}
