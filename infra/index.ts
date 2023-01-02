import { App } from 'aws-cdk-lib';
import { DEFAULT_STAGE_NAME } from './constants';
import { ApplicationLayerStack } from './layers/application.layer';
import { CoreLayerStack } from './layers/core.layer';
import { createName } from './utils/create-name';

// application
const app = new App();

// application config
const config = {
  applicationName: 'atlas',
  stageName: process.env.NODE_ENV ?? DEFAULT_STAGE_NAME,
};

// core layer
const CORE_STACK_NAME = createName('core-layer', config);
const coreStack = new CoreLayerStack(app, CORE_STACK_NAME, config);

// application layer
const APPLICATION_STACK_NAME = createName('application-layer', config);
const applicationStack = new ApplicationLayerStack(
  app,
  APPLICATION_STACK_NAME,
  config,
);

// dependencies
applicationStack.addDependency(coreStack);

// run synth
app.synth();
