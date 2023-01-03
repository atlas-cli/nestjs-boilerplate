import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import { IVpc, Peer, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { createName } from '../../utils/create-name';
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
    new CfnOutput(this, createNameScoped('id', props), {
      value: this.vpc.vpcId,
      exportName: createNameScoped('id', props),
    });
    new CfnOutput(this, createNameScoped('subnet-id-1', props), {
      value: this.vpc.publicSubnets[0].subnetId,
      exportName: createNameScoped('subnet-id-1', props),
    });
    new CfnOutput(this, createNameScoped('subnet-id-2 ', props), {
      value: this.vpc.publicSubnets[1].subnetId,
      exportName: createNameScoped('subnet-id-2', props),
    });
    new CfnOutput(this, createNameScoped('security-group-id', props), {
      value: this.securityGroup.securityGroupId,
      exportName: createNameScoped('security-group-id', props),
    });
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
