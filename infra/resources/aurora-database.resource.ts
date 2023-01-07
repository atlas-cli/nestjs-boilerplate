import { AuroraDatabase } from '../constructs/aurora-database/aurora-database.construct';
import { AuroraDatabaseSecurityGroup } from '../constructs/aurora-database-security-group/aurora-database-security-group.construct';
import { AuroraDatabaseProxy } from '../constructs/aurora-database-proxy/aurora-database-proxy.construct';
import { ApplicationProps } from '../props/application.props';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { createName as defaultCreateName } from '../utils/create-name';

export class AuroraDatabaseResource extends Construct {
  auroraDatabaseProxy: AuroraDatabaseProxy;
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id);
    // setup prefix
    const createName = (name, config) =>
      defaultCreateName(`aurora-stack-${name}`, config);

    // get default account vpc
    const DEFAULT_VPC_NAME = createName('default-vpc', applicationProps);
    const vpc = Vpc.fromLookup(this, DEFAULT_VPC_NAME, {
      isDefault: true,
    });

    // create aurora database security group
    const SECURITY_GROUP_NAME = createName('security-group', applicationProps);
    const { securityGroup } = new AuroraDatabaseSecurityGroup(
      this,
      SECURITY_GROUP_NAME,
      {
        vpc,
        ...applicationProps,
      },
    );

    // create aurora database cluster
    const DATABASE_CLUSTER_NAME = createName('cluster', applicationProps);
    const { databaseCluster } = new AuroraDatabase(
      this,
      DATABASE_CLUSTER_NAME,
      {
        ...applicationProps,
        vpc,
        securityGroup,
      },
    );

    // create aurora database proxy
    const DATABASE_PROXY_NAME = createName('proxy', applicationProps);
    this.auroraDatabaseProxy = new AuroraDatabaseProxy(this, DATABASE_PROXY_NAME, {
      ...applicationProps,
      auroraDatabaseCluster: databaseCluster,
      vpc,
      securityGroup,
    });
  }
}
