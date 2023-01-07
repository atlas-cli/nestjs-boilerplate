import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationProps } from '../props/application.props';
import { DatabaseMigrationResource } from '../resources/database-migration.resource';
import { LambdaResource } from '../resources/lambda.resources';
import { createName } from '../utils/create-name';

export class ApplicationLayerStack extends cdk.Stack {
  databaseMigrationResource: DatabaseMigrationResource;
  lambdaResource: LambdaResource;
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id, applicationProps);

    // application for run database migration
    const DATABASE_MIGRATION_NAME = createName(
      'aurora-database',
      applicationProps,
    );
    this.databaseMigrationResource = new DatabaseMigrationResource(
      this,
      DATABASE_MIGRATION_NAME,
      applicationProps,
    );

    // lambda users resource
    const LAMBDA_RESOURCE_NAME = createName('lambda', applicationProps);
    this.lambdaResource = new LambdaResource(this, LAMBDA_RESOURCE_NAME, applicationProps);
  }
}
