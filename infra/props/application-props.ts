import { StackProps } from 'aws-cdk-lib';

/**
 * Represents the configuration for a stack.
 */
export interface ConfigStack {
  /** The name of the stack. */
  name: string;
  /** The resources provided by the stack. */
  provide: any;
  /** The environment for the stack. */
  env?: Record<string, any>;
  /** The dependencies of the stack. */
  dependencies?: string[];
}

/**
 * Represents the configuration for an application.
 */
export interface ApplicationConfig<Env> {
  /** The domain name for the application. */
  domainName: string;
  /** The domain name for the API. */
  apiDomainName: string;
  /** The ID of the public hosted zone. */
  idPublicHostZone: string;
  /** The environment variables for the application. */
  applicationEnvironment: any;
}

/**
 * Represents a collection of applications with dynamic keys.
 */
interface Applications {
  core: ApplicationConfig<any>;
}

/**
 * Represents the properties for an application stack.
 */
export interface ApplicationProps extends StackProps {
  /** The name of the application. */
  applicationName: string;
  /** The stage name for the application. */
  stageName: string;

  githubOrganizationId?: string;
  /** The environment configuration for the application. */
  env: {
    account: string;
    region: string;
  };
  /** The configuration stacks for the application. */
  layersStack: ConfigStack[];
  /** The applications in the stack. */
  applications: Applications;
}

/**
 * Represents an application resource.
 */
export interface IApplicationResource {
  /** The name of the function. */
  functionName: string;
  /** The name of the module. */
  moduleName: string;
  /** Indicates if Swagger bundling is enabled. */
  swaggerBundling?: boolean;
}
