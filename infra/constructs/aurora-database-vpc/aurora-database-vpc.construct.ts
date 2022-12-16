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

  constructor(scope: Construct, id: string, _props?: AuroraDatabaseVpcProps) {
    super(scope, id);
    const name = 'aurora-database';

    // create a vpc
    this.vpc = new Vpc(this, 'Vpc', {
      vpcName: [name, 'vpc'].join('-'),
      cidr: '10.0.0.0/16',
      subnetConfiguration: [{ name: 'egress', subnetType: SubnetType.PUBLIC }], // only one subnet is needed
      natGateways: 0, // disable NAT gateways
    });

    // create a security group for aurora db
    this.dbSecurityGroup = new SecurityGroup(this, 'DbSecurityGroup', {
      securityGroupName: [name, 'securty-group'].join('-'),
      vpc: this.vpc, // use the vpc created above
      allowAllOutbound: true, // allow outbound traffic to anywhere
    });

    // allow inbound traffic from anywhere to the db
    this.dbSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(5432), // allow inbound traffic on port 5432 (postgres)
      'allow inbound traffic from anywhere to the db on port 5432',
    );

    this.exports(name);
  }

  // export resources
  exports(name: string) {
    new CfnOutput(this, 'AuroraDatabaseVpcId', {
      value: this.vpc.vpcId,
      exportName: name + '-vpc-id',
    });
    new CfnOutput(this, 'AuroraDatabaseSubnetId1', {
      value: this.vpc.publicSubnets[0].subnetId,
      exportName: name + '-subnet-id-1',
    });
    new CfnOutput(this, 'AuroraDatabaseSubnetId2', {
      value: this.vpc.publicSubnets[1].subnetId,
      exportName: name + '-subnet-id-2',
    });
    new CfnOutput(this, 'AuroraDatabaseSecurityGroup', {
      value: this.dbSecurityGroup.securityGroupId,
      exportName: name + '-security-group-id',
    });
  }

  // import resources
  static fromName(scope, auroraName: string) {
    const vpc = Vpc.fromVpcAttributes(scope, 'AuroraDatabaseVpc', {
      vpcId: cdk.Fn.importValue(auroraName + '-vpc-id'),
      availabilityZones: ['sa-east-1'],
      publicSubnetIds: [
        cdk.Fn.importValue(auroraName + '-subnet-id-1'),
        cdk.Fn.importValue(auroraName + '-subnet-id-2'),
      ],
    });
    const securityGroup = SecurityGroup.fromSecurityGroupId(
      scope,
      'AuroraDatabaseSecurityGroup',
      cdk.Fn.importValue(auroraName + '-security-group-id'),
    );
    return {
      vpc,
      securityGroup,
    };
  }
}
