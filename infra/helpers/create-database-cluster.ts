import { Aspects, } from 'aws-cdk-lib';
import { InstanceType, SubnetType } from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { CfnDBCluster } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { AuroraDatabaseProps } from '../props/aurora-database-props';
import { createOutput } from './create-output';
import { ApplicationConfig } from '../props/application-props';

export const createDatabaseCluster = (
    scope: Construct,
    id: string,
    props: AuroraDatabaseProps,
    _applicationConfig: ApplicationConfig<any>,
): rds.DatabaseCluster => {
    const { securityGroup, vpc } = props;
    const clusterProps: rds.DatabaseClusterProps = {
        defaultDatabaseName: id,
        port: 5432,
        engine: rds.DatabaseClusterEngine.auroraPostgres({
            version: rds.AuroraPostgresEngineVersion.VER_14_10, // Aurora PostgreSQL engine version
        }),
        instances: 1,
        storageEncrypted: true, // Enable storage encryption
        instanceProps: {
            vpc: vpc, // VPC for the database instances
            instanceType: new InstanceType('serverless'), // Instance type
            autoMinorVersionUpgrade: true, // Enable automatic minor version upgrades
            securityGroups: [securityGroup], // Security groups for the instances
            vpcSubnets: vpc.selectSubnets({
                subnetType: SubnetType.PUBLIC, // Subnet type for the instances
            }),
        },
    };
    const cluster = new rds.DatabaseCluster(scope, id, clusterProps);

    // Export secret output
    createOutput(scope, `${id}Secret`, cluster.secret?.secretArn);

    return cluster;
};

export const addScalingCapacity = (cluster: rds.DatabaseCluster): void => {
    // Add scaling configuration to the database cluster
    Aspects.of(cluster).add({
        visit(node) {
            if (node instanceof CfnDBCluster) {
                // Set serverless V2 scaling configuration
                node.serverlessV2ScalingConfiguration = {
                    minCapacity: 0.5, // Minimum capacity is 0.5 vCPU
                    maxCapacity: 2, // Maximum capacity is 5 vCPU (default)
                };
            }
        },
    });
};
