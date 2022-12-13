import { App, } from 'aws-cdk-lib';
import { AuroraServerlessV2Stack } from './stacks/aurora.stack';
import { LambdaServiceStack } from './stacks/lambda.stack';

const app = new App();
new AuroraServerlessV2Stack(app, 'aurora-stack', { stage: 'qa'  });
new LambdaServiceStack(app, 'lambda-service-stack', { stage: 'qa' });
app.synth();
