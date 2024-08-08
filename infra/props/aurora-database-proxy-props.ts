import { ISecurityGroup, IVpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseCluster } from 'aws-cdk-lib/aws-rds';
import { ApplicationProps } from './application-props';

/**
 * Represents the properties for an Aurora database proxy.
 */
export interface AuroraDatabaseProxyProps extends ApplicationProps {
  /** The Virtual Private Cloud (VPC) for the Aurora database proxy. */
  vpc: IVpc;
  /** The security group for the Aurora database proxy. */
  securityGroup: ISecurityGroup;
  /** The Aurora database cluster associated with the proxy. */
  auroraDatabaseCluster: DatabaseCluster;
}
