import * as cdk from 'aws-cdk-lib';
import { IVpc, Peer, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { createName } from '../../utils/create-name';
import { createOutput } from '../../utils/create-output';
import { AuroraDatabaseSecurityGroupProps } from './props/aurora-database-security-group.props';

export class AuroraDatabaseSecurityGroup extends Construct {
  vpc: IVpc;
  securityGroup: SecurityGroup;
  constructor(
    scope: Construct,
    id: string,
    props: AuroraDatabaseSecurityGroupProps,
  ) {
    super(scope, id);

    //get vpc
    this.vpc = props.vpc;

    // create a security group for aurora db
    const SECURITY_GROUP_NAME = createName('security-group', props);
    this.securityGroup = new SecurityGroup(this, SECURITY_GROUP_NAME, {
      securityGroupName: SECURITY_GROUP_NAME,
      vpc: this.vpc, // use the vpc created above
      allowAllOutbound: true, // allow outbound traffic to anywhere
    });

    // allow inbound traffic from anywhere to the db
    this.securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(5432), // allow inbound traffic on port 5432 (postgres)
      'allow inbound traffic from anywhere to the db on port 5432',
    );

    // export security group and vpc
    this.exportSecurityGroupAndVpc('security-group', props);
  }

  // export resources
  exportSecurityGroupAndVpc(scopedName: string, props) {
    // create name scoped
    const createNameScoped = (name, config) =>
      createName(`${scopedName}-${name}`, config);

    // outputs
    createOutput(createNameScoped('id', props), this.vpc.vpcId);
    createOutput(createNameScoped('subnet-id-1', props), this.vpc.publicSubnets[0].subnetId);
    createOutput(createNameScoped('subnet-id-2', props), this.vpc.publicSubnets[1].subnetId);
    createOutput(createNameScoped('security-group-id', props), this.securityGroup.securityGroupId);
  }

  // import resources
  static fromName(scope, scopedName: string, props) {
    // create name scoped
    const createNameScoped = (name) =>
      createName(`${scopedName}-${name}`, props);

    // vpc resource
    const vpc = Vpc.fromVpcAttributes(scope, createNameScoped('id'), {
      vpcId: cdk.Fn.importValue(createNameScoped('id')),
      availabilityZones: ['sa-east-1'],
      publicSubnetIds: [
        cdk.Fn.importValue(createNameScoped('subnet-id-1')),
        cdk.Fn.importValue(createNameScoped('subnet-id-2')),
      ],
    });
    const securityGroup = SecurityGroup.fromSecurityGroupId(
      scope,
      createNameScoped('security-group-id'),
      cdk.Fn.importValue(createNameScoped('security-group-id')),
    );
    return {
      vpc,
      securityGroup,
    };
  }
}
