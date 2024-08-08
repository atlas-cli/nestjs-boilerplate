import { DatabaseCluster } from "aws-cdk-lib/aws-rds";

export const createDatabaseAuroraEnvironment = (cluster: DatabaseCluster) => {
    return {
        DATABASE_TYPE: 'aurora-postgres',
        DATABASE_NAME: cluster.clusterIdentifier,
        DATABASE_SECRET_ARN: cluster.secret.secretArn,
        DATABASE_RESOURCE_ARN: cluster.clusterArn,
    };
};

