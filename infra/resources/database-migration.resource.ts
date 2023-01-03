import { ApplicationProps } from '../props/application.props';
import { Construct } from 'constructs';
import { LambdaRole } from '../constructs/lambda-role/lambda-role.construct';
import { AuroraDatabaseProxy } from '../constructs/aurora-database-proxy/aurora-database-proxy.construct';
import { AuroraDatabaseSecurityGroup } from '../constructs/aurora-database-security-group/aurora-database-security-group.construct';
import { LambdaDatabaseMigration } from '../constructs/lambda-database-migration/lambda-database-migration.construct';
import { createName as defaultCreateName } from '../utils/create-name';

export class DatabaseMigrationResource extends Construct {
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
    const { role } = new LambdaRole(this, LAMBDA_ROLE_NAME, applicationProps);

    // get vpc, security group
    const { vpc, securityGroup } = AuroraDatabaseSecurityGroup.fromName(
      this,
      'security-group',
      applicationProps,
    );

    // get proxy
    const { proxy } = AuroraDatabaseProxy.fromNameAndSecurityGroup(
      this,
      'proxy',
      securityGroup,
      applicationProps,
    );

    // grant access to lambda role
    proxy.grantConnect(role, 'postgres');

    // add lambda function for run migrations
    const LAMBDA_DATABASE_MIGRATION_NAME = createAuroraDatabaseName(
      'lambda-database-migration',
      applicationProps,
    );
    new LambdaDatabaseMigration(this, LAMBDA_DATABASE_MIGRATION_NAME, {
      ...applicationProps,
      role,
      vpc: vpc,
      securityGroups: [securityGroup],
    });
  }
}
