import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationProps } from '../../../props/application.props';

export interface AuroraDatabaseSecurityGroupProps extends ApplicationProps {
  vpc: IVpc;
}
