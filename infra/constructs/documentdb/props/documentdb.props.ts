import { ISecurityGroup, IVpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationProps } from '../../../props/application.props';

export interface DocumentDBProps extends ApplicationProps {
  vpc: IVpc;
  securityGroup: ISecurityGroup;
}
