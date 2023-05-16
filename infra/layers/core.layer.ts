import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationProps } from '../props/application.props';
import { DocumentDBResource } from '../resources/documentdb.resource';
import { createName } from '../utils/create-name';

export class CoreLayerStack extends cdk.Stack {
  documentDBResource: DocumentDBResource;
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id, applicationProps);

    // create documentdb database
    const CLUSTER_DATABASE_NAME = createName('documentdb', applicationProps);
    this.documentDBResource = new DocumentDBResource(
      this,
      CLUSTER_DATABASE_NAME,
      applicationProps,
    );
  }
}
