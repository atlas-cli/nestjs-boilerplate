import * as cdk from 'aws-cdk-lib';
import { AuroraDatabase } from './../constructs/aurora-database/aurora-database.construct';
import { AuroraDatabaseVpc } from '../constructs/aurora-database-vpc/aurora-database-vpc.construct';
import { AuroraDatabaseProxy } from '../constructs/aurora-database-proxy/aurora-database-proxy.construct';
import { ApplicationProps } from '../props/application.props';
import { Construct } from 'constructs';

export class AuroraStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id);
    const { applicationName, stageName } = applicationProps;
    const createName = (name: string) =>
      `${stageName}-${applicationName}-aurora-stack-${name}`;

    // create aurora database vpc
    const auroraDatabaseVpc = new AuroraDatabaseVpc(
      this,
      createName(`vpc`),
      applicationProps,
    );
    // create aurora database cluster
    const { databaseCluster } = new AuroraDatabase(
      this,
      createName(`cluster`),
      {
        ...applicationProps,
        auroraDatabaseVpc,
      },
    );

    // create aurora database proxy
    new AuroraDatabaseProxy(this, createName(`proxy`), {
      ...applicationProps,
      auroraDatabaseCluster: databaseCluster,
      auroraDatabaseVpc,
    });
  }
}
