import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ApplicationProps } from '../../../props/application.props';

export type LambdaDatabaseMigrationProps = LambdaDatabaseMigrationPropsRequired;
export interface LambdaDatabaseMigrationPropsRequired
  extends NodejsFunctionProps,
  ApplicationProps {
}
