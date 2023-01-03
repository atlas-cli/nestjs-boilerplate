import { StackProps } from 'aws-cdk-lib';

export interface ApplicationProps extends StackProps {
  applicationName: string;
  stageName: string;
  createNameCustom?: (name: string, config: ApplicationProps) => string;
  env: any;
  layersStack: {
    core: any;
    application: any;
  };
}
