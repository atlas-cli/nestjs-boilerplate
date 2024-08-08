import { Construct } from 'constructs';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import {
  ApplicationConfig,
  ApplicationProps,
} from '../props/application-props';
import {
  addScalingCapacity,
  createDatabaseCluster,
} from './create-database-cluster';
import { createOutput } from './create-output';
import { createAndExportGenericSecurityGroup } from './setup-generic-security-group';

export const setupAuroraDatabase = (
  scope: Construct,
  scopedName: string,
  applicationProps: ApplicationProps,
  applicationConfig: ApplicationConfig<any>,
  vpc: IVpc,
) => {
  // Create a security group for the database
  const databaseSecurityGroup = createAndExportGenericSecurityGroup(
    scope,
    scopedName + 'DatabaseSecurityGroup',
    {
      name: scopedName + 'DatabaseSecurityGroup',
      vpc,
      ...applicationProps,
    },
  );

  // Create the Aurora database cluster
  const databaseCluster = createDatabaseCluster(
    scope,
    scopedName + 'DatabaseCluster',
    {
      ...applicationProps,
      vpc,
      securityGroup: databaseSecurityGroup.securityGroup,
    },
  );

  addScalingCapacity(databaseCluster);
  // Create output
  createOutput(
    scope,
    `${scopedName}DatabaseClusterHost`,
    databaseCluster.clusterEndpoint.hostname,
  );

  return databaseCluster;
};
