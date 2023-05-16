import * as cdk from 'aws-cdk-lib';
import { IVpc, Peer, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { vpcCDIR } from '../../constants';
import { createName } from '../../utils/create-name';
import { createOutput } from '../../utils/create-output';
import { DocumentDBSecurityGroupProps } from './props/documentdb-security-group.props';

export class DocumentDBSecurityGroup extends Construct {
  vpc: IVpc;
  securityGroup: SecurityGroup;
  constructor(
    scope: Construct,
    id: string,
    props: DocumentDBSecurityGroupProps,
  ) {
    super(scope, id);

    //get vpc
    this.vpc = props.vpc;

    // create a security group for document db
    const SECURITY_GROUP_NAME = createName('documentdb-security-group', props);
    this.securityGroup = new SecurityGroup(this, SECURITY_GROUP_NAME, {
      securityGroupName: SECURITY_GROUP_NAME,
      vpc: this.vpc, // use the vpc created above
      allowAllOutbound: true, // allow outbound traffic to anywhere
    });

    // export security group and vpc
    this.exportSecurityGroupAndVpc('security-group', props);
  }

  // export resources
  exportSecurityGroupAndVpc(scopedName: string, props) {
    // create name scoped
    const createNameScoped = (name, config) =>
      createName(`${scopedName}-${name}`, config);

    // outputs
    createOutput(this, createNameScoped('id', props), this.vpc.vpcId);
    createOutput(
      this,
      createNameScoped('subnet-public-id-1', props),
      this.vpc.publicSubnets[0].subnetId,
    );
    createOutput(
      this,
      createNameScoped('subnet-public-id-2', props),
      this.vpc.publicSubnets[1].subnetId,
    );
    createOutput(
      this,
      createNameScoped('subnet-private-id-1', props),
      this.vpc.privateSubnets[0].subnetId,
    );
    createOutput(
      this,
      createNameScoped('subnet-private-id-2', props),
      this.vpc.privateSubnets[1].subnetId,
    );
    createOutput(
      this,
      createNameScoped('security-group-id', props),
      this.securityGroup.securityGroupId,
    );
  }

  // import resources
  static fromName(scope, scopedName: string, props) {
    // create name scoped
    const createNameScoped = (name) =>
      createName(`${scopedName}-${name}`, props);

    // vpc resource
    const vpc = Vpc.fromVpcAttributes(scope, createNameScoped('id'), {
      vpcId: cdk.Fn.importValue(createNameScoped('id')),
      availabilityZones: ['us-east-2a', 'us-east-2b'],
      privateSubnetIds: [
        cdk.Fn.importValue(createNameScoped('subnet-private-id-1')),
        cdk.Fn.importValue(createNameScoped('subnet-private-id-2')),
      ],
      publicSubnetIds: [
        cdk.Fn.importValue(createNameScoped('subnet-public-id-1')),
        cdk.Fn.importValue(createNameScoped('subnet-public-id-2')),
      ],
    });

    const securityGroup = SecurityGroup.fromSecurityGroupId(
      scope,
      createNameScoped('security-group-id'),
      cdk.Fn.importValue(createNameScoped('security-group-id')),
    );

    securityGroup.addIngressRule(Peer.ipv4(vpcCDIR), Port.tcp(27017));

    return {
      vpc,
      securityGroup,
    };
  }
}
