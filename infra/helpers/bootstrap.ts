import { App } from 'aws-cdk-lib';
import { DEFAULT_STAGE_NAME } from './../constants';
import { ApplicationProps } from './../props/application-props';

const bootstrapInfrastructure = (environments: {
  [key: string]: ApplicationProps;
}) => {
  const app = new App();

  // Get the current environment from the context or use the default.
  const environment =
    app.node.tryGetContext('environment') ?? DEFAULT_STAGE_NAME;

  // Check if the environment exists in the provided configurations.
  if (!environments[environment]) {
    console.error('This environment does not exist.');
    return null;
  }

  const applicationProps = environments[environment];
  const { layersStack } = applicationProps;
  const layerCreated: { [key: string]: any } = {};

  // Iterate over each layer in the stack.
  layersStack.forEach(({ name, provide, dependencies }: any) => {
    // Generate a unique stack name for the current layer.
    const CORE_STACK_NAME = name;
    const config = {
      ...applicationProps,
      env: applicationProps.env,
      layersCreated: layerCreated,
    };
    // Create an instance of the current layer and store it in the layerCreated object.
    layerCreated[name] = new provide(app, CORE_STACK_NAME, config);

    // Add dependencies to the current layer, if any.
    if (dependencies) {
      dependencies.forEach((dependencyName: string) =>
        layerCreated[name].addDependency(layerCreated[dependencyName]),
      );
    }
  });

  return app;
};

/**
 * Function to synthesize the infrastructure and generate CloudFormation templates.
 * @param app - Instance of the CDK app.
 */
const synthesizeInfrastructure = (app: App) => {
  app.synth();
};

/**
 * Main execution function.
 * @param environments - Object containing application properties for each environment.
 */
export const bootstrap = (environments: {
  [key: string]: ApplicationProps;
}) => {
  const app = bootstrapInfrastructure(environments);
  if (app) {
    synthesizeInfrastructure(app);
  }
};
