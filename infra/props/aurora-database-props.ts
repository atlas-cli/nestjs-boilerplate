import { ISecurityGroup, IVpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationProps } from './application-props';

/**
 * Represents the properties for an Aurora database.
 */
export interface AuroraDatabaseProps extends ApplicationProps {
  /** The Virtual Private Cloud (VPC) associated with the Aurora database. */
  vpc: IVpc;
  /** The security group associated with the Aurora database. */
  securityGroup: ISecurityGroup;
}
