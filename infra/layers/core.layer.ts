import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationProps } from '../props/application.props';
import { AuroraStack } from '../stacks/aurora.stack';
import { DatabaseMigrationStack } from '../stacks/database-migration.stack';

export class CoreLayerStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id);

    // create name function
    const createName = (name) =>
      `${applicationProps.applicationName}-${applicationProps.stageName}-${name}`;

    // nested stacks
    const auroraStack = new AuroraStack(
      this,
      createName('aurora-database'),
      applicationProps,
    );
    const databaseMigration = new DatabaseMigrationStack(
      this,
      createName('database-migration'),
      applicationProps,
    );

    // declare dependency
    databaseMigration.addDependency(auroraStack);
  }
}
