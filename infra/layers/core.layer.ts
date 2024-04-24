import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationProps } from '../props/application.props';
import { AuroraDatabaseResource } from '../resources/aurora-database.resource';
import { createName } from '../utils/create-name';

export class CoreLayerStack extends cdk.Stack {
  auroraDatabaseResource: AuroraDatabaseResource;
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id, applicationProps);

    // aurora database
    const AURORA_DATABASE_NAME = createName(
      'aurora-database',
      applicationProps,
    );
    this.auroraDatabaseResource = new AuroraDatabaseResource(
      this,
      AURORA_DATABASE_NAME,
      applicationProps,
    );
  }
}
