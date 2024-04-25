import { AtlasInfraestructure } from './factories/infraestructure';
import { ApplicationLayerStack } from './layers/application.layer';
import { CoreLayerStack } from './layers/core.layer';

/**
 * Function to create layers stack. It creates 'core-layer' and 'application-layer'.
 *
 * @param accountId - Account Id which will be used for creating the layers.
 * @returns array of layers.
 */
const createStacks = (accountId: string) => {
  return [
    { name: 'core-layer', provide: CoreLayerStack },
    {
      name: 'application-layer',
      provide: ApplicationLayerStack,
      dependencies: ['core-layer'],
    }
  ];
};

/**
 * Configuration for the application. Contains configurations for both production and development.
 */
const infraestructure = new AtlasInfraestructure({
  production: {
    // Name of your application
    applicationName: 'atlas',
    // Stage name for the environment
    stageName: 'production',
    // Domain name  environment
    domainName: 'sandbox.slingui.com',
    // API domain name for the environment
    apiDomainName: 'api.sandbox.slingui.com',
    // Public host ID for the  environment (AWS Route 53 Hosted Zone ID)
    idPublicHostZone: 'Z01545163ANT5OQYS99UY',
    env: {
      // AWS account ID for the environment
      account: '767397837500',
      // AWS region for the environment (e.g., 'us-east-1')
      region: 'us-east-1',
    },
    layersStack: createStacks('767397837500'),
  },
  development: {
    // Name of your application
    applicationName: 'atlas',
    // Stage name for the environment
    stageName: 'development',
    // Domain name  environment
    domainName: 'sandbox.slingui.com',
    // API domain name for the environment
    apiDomainName: 'api.sandbox.slingui.com',
    // Public host zone ID for the  environment (AWS Route 53 Hosted Zone ID)
    idPublicHostZone: 'Z01545163ANT5OQYS99UY',
    env: {
      // AWS account ID for the environment
      account: '767397837500',
      // AWS region for the environment (e.g., 'us-east-1')
      region: 'us-east-1',
    },
    layersStack: createStacks('767397837500'),
  },
});

// Execute synth method
infraestructure.synth();