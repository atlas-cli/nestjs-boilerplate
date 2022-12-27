import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ApplicationProps } from '../../../props/application.props';

export interface LambdaDatabaseMigrationProps
  extends LambdaDatabaseMigrationPropsRequired {}
export interface LambdaDatabaseMigrationPropsRequired extends NodejsFunctionProps, ApplicationProps {

}
