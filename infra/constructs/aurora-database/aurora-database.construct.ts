import * as rds from 'aws-cdk-lib/aws-rds';
import { Aspects } from 'aws-cdk-lib';
import { InstanceType, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { CfnDBCluster } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { AuroraDatabaseVpc } from '../aurora-database-vpc/aurora-database-vpc.construct';
import { AuroraDatabaseProps } from './props/aurora-database.props';
import { AuroraDatabaseVpcProps } from '../aurora-database-vpc/props/aurora-database-vpc.props';

export class AuroraDatabase extends Construct {
  databaseCluster: rds.DatabaseCluster;

  constructor(
    scope: Construct,
    id: string,
    {
      applicationName,
      stageName,
      createNameCustom,
      auroraDatabaseVpc,
    }: AuroraDatabaseProps,
  ) {
    super(scope, id);
    const createName: any =
      createNameCustom !== undefined
        ? createNameCustom(stageName, applicationName)
        : (name: string) =>
            `${stageName}-${applicationName}-aurora-database-${name}`;

    // if not provided create a new vpc and security groups
    const { vpc, dbSecurityGroup } =
      auroraDatabaseVpc ??
      new AuroraDatabaseVpc(this, createName('vpc'), {
        applicationName,
        stageName,
        createNameCustom,
      });

    // create a aurora db cluster serverless v2 postgres
    this.databaseCluster = new rds.DatabaseCluster(
      this,
      createName('cluster'),
      {
        instances: 1,
        iamAuthentication: true,
        port: 5432,
        engine: rds.DatabaseClusterEngine.auroraPostgres({
          version: rds.AuroraPostgresEngineVersion.VER_13_6,
        }),
        instanceProps: {
          vpc: vpc,
          instanceType: new InstanceType('serverless'),
          autoMinorVersionUpgrade: true,
          publiclyAccessible: false,
          securityGroups: [dbSecurityGroup],
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
