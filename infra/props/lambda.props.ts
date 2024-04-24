import { ApplicationProps } from './application.props';

export interface LambdaProps extends ApplicationProps {
  functionName: string;
  moduleName: string;
  queues?: any;
  buckets?: any;
  cloudfronts?: any;
  swaggerBundling?: boolean;
}
