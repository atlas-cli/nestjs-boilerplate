import { App, } from 'aws-cdk-lib';
import { AuroraStack } from './stacks/aurora.stack';
import { LambdaServiceStack } from './stacks/lambda.stack';

// application
const app = new App();

// stacks
new AuroraStack(app, 'aurora-stack', { stage: 'qa'  });
new LambdaServiceStack(app, 'lambda-service-stack', { stage: 'qa' });

// run synth
app.synth();
