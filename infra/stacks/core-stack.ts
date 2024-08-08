import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationProps } from '../props/application-props';
import { setupAuroraDatabase } from '../helpers/aurora';
import { createVpc } from '../helpers/create-vpc';

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, applicationProps: ApplicationProps) {
    super(scope, id, applicationProps);

    const { applications } = applicationProps;
    const scopedName = 'Core';

    const vpc = createVpc(this, scopedName);
    if (applications.core) {
      setupAuroraDatabase(this, scopedName, applicationProps, applicationProps.applications.core, vpc);
    }
  }
}
