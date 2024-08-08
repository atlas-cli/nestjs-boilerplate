import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationProps } from './application-props';

/**
 * Represents the properties for a generic security group.
 */
export interface GenericSecurityGroupProps extends ApplicationProps {
  /** The name of the security group. */
  name: string;
  /** The Virtual Private Cloud (VPC) associated with the security group. */
  vpc?: IVpc;
}
