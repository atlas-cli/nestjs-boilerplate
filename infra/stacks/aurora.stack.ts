import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuroraDatabase } from './../constructs/aurora-database/aurora-database.construct';
import { AuroraDatabaseVpc } from '../constructs/aurora-database-vpc/aurora-database-vpc.construct';
import { AuroraDatabaseProxy } from '../constructs/aurora-database-proxy/aurora-database-proxy.construct';

export class AuroraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, {}: any) {
    super(scope, id);

    // create aurora database vpc
    const auroraDatabaseVpc = new AuroraDatabaseVpc(this, 'AuroraDatabaseVpc');
    // create aurora database cluster
    const { databaseCluster } = new AuroraDatabase(this, 'AuroraDatabase', {
      auroraDatabaseVpc,
    });
    
    // create aurora database proxy
    new AuroraDatabaseProxy(this, 'AuroraDatabaseProxy', {
      auroraDatabaseCluster: databaseCluster,
      auroraDatabaseVpc,
    });
  }
}
