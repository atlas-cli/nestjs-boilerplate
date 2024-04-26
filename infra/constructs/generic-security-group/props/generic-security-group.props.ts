import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationProps } from '../../../props/application.props';

export interface GenericSecurityGroupProps extends ApplicationProps {
  name: string;
  vpc: IVpc;
}
