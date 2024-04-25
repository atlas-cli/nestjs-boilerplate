/* eslint-disable prettier/prettier */
import { ApplicationProps } from '../props/application.props';
import { Construct } from 'constructs';
import { LambdaRole } from '../constructs/lambda-role/lambda-role.construct';
import { AuroraDatabaseProxy } from '../constructs/aurora-database-proxy/aurora-database-proxy.construct';
import { GenericSecurityGroup } from '../constructs/generic-security-group/generic-security-group.construct';
import { LambdaDatabaseMigration } from '../constructs/lambda-database-migration/lambda-database-migration.construct';
import { createName as defaultCreateName } from '../utils/create-name';
import { Port } from 'aws-cdk-lib/aws-ec2';

export class DatabaseMigrationResource extends Construct {
  lambdaDatabaseMigration: LambdaDatabaseMigration;
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id);

    // setup prefix
    const createName = (name, config) =>
      defaultCreateName(`database-migration-${name}`, config);

    const createAuroraDatabaseName = (name, config) =>
      defaultCreateName(`aurora-database-${name}`, config);

    // add lambda function for run migrations
    const LAMBDA_ROLE_NAME = createName('lambda-role', applicationProps);
    const { role } = new LambdaRole(this, LAMBDA_ROLE_NAME);

    // get vpc, security group from db
    const { vpc } = GenericSecurityGroup.fromName(
      this,
      'database-sg',
      applicationProps,
    );

    // get vpc, security group from proxy
    const { securityGroup: databaseProxySecurityGroup } = GenericSecurityGroup.fromName(
      this,
      'database-proxy-sg',
      applicationProps,
    );

    // get proxy
    const { proxy } = AuroraDatabaseProxy.fromNameAndSecurityGroup(
      this,
      'aurora-database-proxy',
      databaseProxySecurityGroup,
      applicationProps,
    );

    // grant access to lambda role
    proxy.grantConnect(role, 'postgres');

    //Lambda SG
    const lambdaSecurityGroup = new GenericSecurityGroup(
      this,
      createName('lambda-migration-sg', applicationProps),
      {
        name: 'lambda-migration-sg',
        vpc,
        ...applicationProps,
      },
    );

    // Lambda access to proxy
    databaseProxySecurityGroup.addIngressRule(lambdaSecurityGroup.securityGroup, Port.tcp(5432), `Allows access from the migrations lambda to the ${proxy.dbProxyName}`);


    // add lambda function for run migrations
    const LAMBDA_DATABASE_MIGRATION_NAME = createAuroraDatabaseName(
      'lambda-database-migration',
      applicationProps,
    );
    this.lambdaDatabaseMigration = new LambdaDatabaseMigration(this, LAMBDA_DATABASE_MIGRATION_NAME, {
      ...applicationProps,
      role,
      vpc: vpc,
      securityGroups: [lambdaSecurityGroup.securityGroup],
    });
  }
}
