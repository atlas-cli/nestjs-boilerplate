import { Stack } from 'aws-cdk-lib';
import { importGenericSecurityGroupResources } from '../helpers/setup-generic-security-group';
import { setupBastion } from '../helpers/setup-bastion';
import { ApplicationProps } from '../props/application-props';
import { Peer, Port } from 'aws-cdk-lib/aws-ec2';

export class BastionStack extends Stack {
  constructor(scope: any, id: string, props: ApplicationProps) {
    super(scope, id, props);
    const scopedName = 'Core';
    const { vpc, securityGroup } = importGenericSecurityGroupResources(
      this,
      scopedName + 'DatabaseSecurityGroup',
    );

    if (props.applications.core) {
      // enable ssh port
      securityGroup.addIngressRule(
        Peer.anyIpv4(),
        Port.tcp(22),
        'Add public access to ssh',
      );

      // Setup the bastion host using the same security group as the application
      setupBastion(this, scopedName, vpc, securityGroup);
    }
  }
}
