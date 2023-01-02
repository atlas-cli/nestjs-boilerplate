import { ISecurityGroup, IVpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseCluster } from 'aws-cdk-lib/aws-rds';
import { ApplicationProps } from '../../../props/application.props';

export interface AuroraDatabaseProxyProps extends ApplicationProps {
  vpc: IVpc;
  securityGroup: ISecurityGroup;
  auroraDatabaseCluster: DatabaseCluster;
}
