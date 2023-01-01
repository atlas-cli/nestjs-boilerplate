import * as cdk from 'aws-cdk-lib';
import { ApplicationProps } from '../props/application.props';
import { Construct } from 'constructs';
import { LambdaRole } from '../constructs/lambda-role/lambda-role.construct';
import { AuroraDatabaseProxy } from '../constructs/aurora-database-proxy/aurora-database-proxy.construct';
import { AuroraDatabaseVpc } from '../constructs/aurora-database-vpc/aurora-database-vpc.construct';
import { LambdaDatabaseMigration } from '../constructs/lambda-database-migration/lambda-database-migration.construct';

export class DatabaseMigrationStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id);
    const createName = (name: string) =>
      `${applicationProps.stageName}-${applicationProps.applicationName}-database-migration-${name}`;
    const createAuroraDatabaseName = (name: string) =>
      `${applicationProps.stageName}-${applicationProps.applicationName}-aurora-database-${name}`;
    // add lambda function for run migrations
    const { role } = new LambdaRole(
      this,
      createName('role-migration'),
      applicationProps,
    );
    // get vpc, security group and proxy
    const { vpc, securityGroup } = AuroraDatabaseVpc.fromName(
      this,
      createAuroraDatabaseName('vpc'),
    );
    const { proxy } = AuroraDatabaseProxy.fromNameAndSecurityGroup(
      this,
      createAuroraDatabaseName('proxy'),
      securityGroup,
    );

    // grant access to role
    proxy.grantConnect(role, 'postgres');

    // // add lambda function for run migrations
    new LambdaDatabaseMigration(this, createName('lambda-database-migration'), {
      ...applicationProps,
      role,
      vpc: vpc,
      securityGroups: [securityGroup],
    });
  }
}
