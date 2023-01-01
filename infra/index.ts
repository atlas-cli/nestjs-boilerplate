import { App } from 'aws-cdk-lib';
import { ApplicationLayerStack } from './layers/application.layer';
import { CoreLayerStack } from './layers/core.layer';
// import { MainStack } from './layers/main';

// application
const app = new App();

// application config
const config = {
  applicationName: 'atlas',
  stageName: process.env.NODE_ENV ?? 'development',
};
const createName = (name) =>
  `${config.applicationName}-${config.stageName}-${name}`;

// layer stacks
// new MainStack(app, createName('main-layer'), config);
const coreStack = new CoreLayerStack(app, createName('core-layer'), config);
const applicationStack = new ApplicationLayerStack(
  app,
  createName('application-layer'),
  config,
);
applicationStack.addDependency(coreStack);

// run synth
app.synth();
