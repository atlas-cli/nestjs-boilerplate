import { StackProps } from 'aws-cdk-lib';

export interface LayerStack {
  name: string;
  provide: any;
  env?: any;
  dependencies?: string[];
}

export interface ApplicationProps extends StackProps {
  applicationName: string;
  domainName: string;
  apiDomainName: string;
  idPublicHostZone: string;
  stageName: string;
  createNameCustom?: (name: string, config: ApplicationProps) => string;
  env: any;
  layersStack: LayerStack[];
  layersCreated?: any;
}

export interface IApplicationResource {
  functionName: string;
  moduleName: string;
  swaggerBundling?: boolean;
}
