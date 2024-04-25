/* eslint-disable prettier/prettier */
import * as cdk from 'aws-cdk-lib';
import { ISecurityGroup, IVpc, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { createName } from '../../utils/create-name';
import { createOutput } from '../../utils/create-output';
import { GenericSecurityGroupProps } from './props/generic-security-group.props';

export class GenericSecurityGroup extends Construct {
  vpc: IVpc;
  securityGroup: SecurityGroup;
  constructor(
    scope: Construct,
    id: string,
    props: GenericSecurityGroupProps,
  ) {
    super(scope, id);

    //get vpc
    this.vpc = props.vpc;

    // create a security group for aurora db
    const SECURITY_GROUP_NAME = createName(id, props);
    this.securityGroup = new SecurityGroup(this, SECURITY_GROUP_NAME, {
      securityGroupName: SECURITY_GROUP_NAME,
      vpc: this.vpc, // use the vpc created above
      allowAllOutbound: true, // allow outbound traffic to anywhere
    });

    // export security group and vpc
    this.exportSecurityGroupAndVpc(props.name, props);
  }

  addIngressSecurityGroup(ingressSg: ISecurityGroup, port: Port, description: string) {
    this.securityGroup.addIngressRule(ingressSg, port, description);

  }

  // export resources
  exportSecurityGroupAndVpc(scopedName: string, props) {
    // create name scoped
    const createNameScoped = (name, config) =>
      createName(`${scopedName}-${name}`, config);

    // outputs
    console.log('export', createNameScoped('id', props));
    createOutput(this, createNameScoped('id', props), this.vpc.vpcId);
    createOutput(this, createNameScoped('subnet-id-1', props), this.vpc.publicSubnets[0].subnetId);
    createOutput(this, createNameScoped('subnet-route-table-id-1', props), this.vpc.publicSubnets[0].routeTable.routeTableId);
    createOutput(this, createNameScoped('subnet-id-2', props), this.vpc.publicSubnets[1].subnetId);
    createOutput(this, createNameScoped('subnet-route-table-id-2', props), this.vpc.publicSubnets[1].routeTable.routeTableId);
    createOutput(this, createNameScoped('security-group-id', props), this.securityGroup.securityGroupId);
  }

  // import resources
  static fromName(scope, scopedName: string, props) {
    // create name scoped
    const createNameScoped = (name) =>
      createName(`${scopedName}-${name}`, props);
    console.log('import', createNameScoped('id'));

    // vpc resource
    const vpc = Vpc.fromVpcAttributes(scope, createNameScoped('id'), {
      vpcId: cdk.Fn.importValue(createNameScoped('id')),
      availabilityZones: ['sa-east-1'],
      publicSubnetIds: [
        cdk.Fn.importValue(createNameScoped('subnet-id-1')),
        cdk.Fn.importValue(createNameScoped('subnet-id-2')),
      ],
      publicSubnetRouteTableIds: [
        cdk.Fn.importValue(createNameScoped('subnet-route-table-id-1')),
        cdk.Fn.importValue(createNameScoped('subnet-route-table-id-2')),
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
