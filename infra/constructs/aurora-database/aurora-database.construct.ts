import { Aspects } from 'aws-cdk-lib';
import {
  InstanceType,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { CfnDBCluster } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { createName } from '../../utils/create-name';
import { AuroraDatabaseProps } from './props/aurora-database.props';

export class AuroraDatabase extends Construct {
  databaseCluster: rds.DatabaseCluster;

  constructor(
    scope: Construct,
    id: string,
    auroraDatabaseProps: AuroraDatabaseProps,
  ) {
    super(scope, id);

    // get vpc and security group
    const { securityGroup, vpc } = auroraDatabaseProps;

    // create a aurora db cluster serverless v2 postgres
    const DATABASE_CLUSTER_NAME = createName('cluster', auroraDatabaseProps);
    this.databaseCluster = new rds.DatabaseCluster(
      this,
      DATABASE_CLUSTER_NAME,
      {
        instances: 1,
        iamAuthentication: true,
        port: 5432,
        engine: rds.DatabaseClusterEngine.auroraPostgres({
          version: rds.AuroraPostgresEngineVersion.VER_16_1,
        }),
        storageEncrypted: true,
        instanceProps: {
          vpc: vpc,
          instanceType: new InstanceType('serverless'),
          autoMinorVersionUpgrade: true,
          securityGroups: [securityGroup],
          vpcSubnets: vpc.selectSubnets({
            subnetType: SubnetType.PUBLIC, // use the public subnet created above for the db
          }),
        },
      },
    );

    // add capacity to the db cluster to enable scaling
    Aspects.of(this.databaseCluster).add({
      visit(node) {
        if (node instanceof CfnDBCluster) {
          node.serverlessV2ScalingConfiguration = {
            minCapacity: 0.5, // min capacity is 0.5 vCPU
            maxCapacity: 1, // max capacity is 1 vCPU (default)
          };
        }
      },
    });
  }
}
