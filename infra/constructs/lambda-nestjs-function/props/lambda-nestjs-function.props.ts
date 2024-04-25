import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ApplicationProps } from '../../../props/application.props';

export type LambdaNestJsFunctionProps = LambdaNestJsFunctionPropsRequired;
export interface LambdaNestJsFunctionPropsRequired
  extends NodejsFunctionProps,
  ApplicationProps {
  functionName: string;
  moduleName: string;
  swaggerBundling?: boolean;
  queues?: any;
  buckets?: any;
  cloudfronts?: any;
  appPath?: string[];
}
