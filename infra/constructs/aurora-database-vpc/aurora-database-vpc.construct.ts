import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import {
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { AuroraDatabaseVpcProps } from './props/aurora-database-vpc.props';

export class AuroraDatabaseVpc extends Construct {
  vpc: Vpc;
  dbSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: AuroraDatabaseVpcProps) {
    super(scope, id);
    const { applicationName, stageName, createNameCustom } = props;
    const createName: any =
      createNameCustom !== undefined
        ? createNameCustom(stageName, applicationName)
        : (name: string) =>
            `${stageName}-${applicationName}-aurora-database-${name}`;

    // create a vpc
    this.vpc = new Vpc(this, createName('vpc'), {
      vpcName: createName('vpc'),
      cidr: '10.0.0.0/16',
      subnetConfiguration: [{ name: 'egress', subnetType: SubnetType.PUBLIC }], // only one subnet is needed
      natGateways: 0, // disable NAT gateways
    });

    // create a security group for aurora db
    this.dbSecurityGroup = new SecurityGroup(
      this,
      createName('security-group'),
      {
        securityGroupName: createName('security-group'),
        vpc: this.vpc, // use the vpc created above
        allowAllOutbound: true, // allow outbound traffic to anywhere
      },
    );

    // allow inbound traffic from anywhere to the db
    this.dbSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(5432), // allow inbound traffic on port 5432 (postgres)
      'allow inbound traffic from anywhere to the db on port 5432',
    );
    this.exports(createName('vpc'));
  }

  // export resources
  exports(scopedName: string) {
    const createName = (name: string) => `${scopedName}-${name}`;
    new CfnOutput(this, createName('id'), {
      value: this.vpc.vpcId,
      exportName: createName('id'),
    });
    new CfnOutput(this, createName('subnet-id-1'), {
      value: this.vpc.publicSubnets[0].subnetId,
      exportName: createName('subnet-id-1'),
    });
    new CfnOutput(this, createName('subnet-id-2 '), {
      value: this.vpc.publicSubnets[1].subnetId,
      exportName: createName('subnet-id-2'),
    });
    new CfnOutput(this, createName('security-group'), {
      value: this.dbSecurityGroup.securityGroupId,
      exportName: createName('security-group'),
    });
  }

  // import resources
  static fromName(scope, scopedName: string) {
    const createName = (name: string) => `${scopedName}-${name}`;
    const vpc = Vpc.fromVpcAttributes(scope, createName('id'), {
      vpcId: cdk.Fn.importValue(createName('id')),
      availabilityZones: ['sa-east-1'],
      publicSubnetIds: [
        cdk.Fn.importValue(createName('subnet-id-1')),
        cdk.Fn.importValue(createName('subnet-id-2')),
      ],
    });
    const securityGroup = SecurityGroup.fromSecurityGroupId(
      scope,
      createName('security-group-id'),
      cdk.Fn.importValue(createName('security-group-id')),
    );
    return {
      vpc,
      securityGroup,
    };
  }
}
