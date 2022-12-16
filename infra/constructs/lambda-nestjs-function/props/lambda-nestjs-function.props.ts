import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface LambdaNestJsFunctionProps
  extends LambdaNestJsFunctionPropsRequired {}
export interface LambdaNestJsFunctionPropsRequired extends NodejsFunctionProps {
  functionName: string;
  moduleName: string;
}
