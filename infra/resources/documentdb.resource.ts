import { DocumentDB } from '../constructs/documentdb/documentdb.construct';
import { ApplicationProps } from '../props/application.props';
import { Construct } from 'constructs';
import { IpAddresses, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { createName as defaultCreateName } from '../utils/create-name';
import { DocumentDBSecurityGroup } from '../constructs/documentdb-security-group/documentdb-security-group.construct';
import { vpcCDIR } from '../constants';

export class DocumentDBResource extends Construct {
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id);
    // setup prefix
    const createName = (name, config) =>
      defaultCreateName(`documentdb-stack-${name}`, config);

    // create vpc for resources
    const VPC_NAME = createName('vpc', applicationProps);
    const vpc = new Vpc(this, VPC_NAME, {
      vpcName: VPC_NAME,
      ipAddresses: IpAddresses.cidr(vpcCDIR),
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
          name: 'subnet-public',
        },
        {
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
          name: 'subnet-private',
        },
      ],
    });

    // create DocumentDB security group
    const SECURITY_GROUP_NAME = createName('security-group', applicationProps);
    const { securityGroup } = new DocumentDBSecurityGroup(
      this,
      SECURITY_GROUP_NAME,
      {
        vpc,
        ...applicationProps,
      },
    );

    // create DocumentDB database cluster
    const DATABASE_CLUSTER_NAME = createName('cluster', applicationProps);
    new DocumentDB(this, DATABASE_CLUSTER_NAME, {
      ...applicationProps,
      vpc,
      securityGroup,
    });
  }
}
