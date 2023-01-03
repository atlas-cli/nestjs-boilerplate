import { DEFAULT_STAGE_NAME } from './constants';
import { AtlasInfraestructure } from './factories/infraestructure';
import { ApplicationLayerStack } from './layers/application.layer';
import { CoreLayerStack } from './layers/core.layer';

// application config
new AtlasInfraestructure({
  applicationName: 'atlas',
  stageName: process.env.NODE_ENV ?? DEFAULT_STAGE_NAME,
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
  },
  layersStack: {
    core: CoreLayerStack,
    application: ApplicationLayerStack,
  },
});
