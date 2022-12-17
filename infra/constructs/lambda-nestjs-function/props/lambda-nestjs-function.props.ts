import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ApplicationProps } from '../../../props/appplication.props';

export interface LambdaNestJsFunctionProps
  extends LambdaNestJsFunctionPropsRequired {}
export interface LambdaNestJsFunctionPropsRequired extends NodejsFunctionProps, ApplicationProps {
  functionName: string;
  moduleName: string;
}
