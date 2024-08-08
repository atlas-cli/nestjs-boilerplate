import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ISecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { DatabaseCluster } from 'aws-cdk-lib/aws-rds';

export type LambdaNestJsFunctionProps = LambdaNestJsFunctionPropsRequired;
export interface LambdaNestJsFunctionPropsRequired
    extends NodejsFunctionProps {
    functionName: string;
    moduleName: string;
    swaggerBundling?: boolean;
    queues?: any;
    buckets?: any;
    securityGroup: ISecurityGroup;
    database?: DatabaseCluster;
    cloudfronts?: any;
    appPath?: string[];
}