import { App } from 'aws-cdk-lib';
import { AuroraStack } from './stacks/aurora.stack';
import { LambdaStack } from './stacks/lambda.stack';

// application
const app = new App();

// application config
const config = {
  applicationName: 'atlas',
  stageName: process.env.NODE_ENV ?? 'dev',
};
const createName = (name) =>
  `${config.applicationName}-${config.stageName}-${name}`;

// stacks
new AuroraStack(app, createName('aurora-database'), config);
new LambdaStack(app, createName('lambda'), config);

// run synth
app.synth();
