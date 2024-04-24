import { App } from 'aws-cdk-lib';
import { DEFAULT_STAGE_NAME } from '../constants';
import { ApplicationProps } from '../props/application.props';
import { createName } from './../utils/create-name';

export class AtlasInfraestructure {
  app: App;
  constructor(environments: { [key: string]: ApplicationProps }) {
    // Create a new CDK app
    this.app = new App();

    const environment =
      this.app.node.tryGetContext('environment') ?? DEFAULT_STAGE_NAME;

    if (!environments[environment]) {
      console.log('This environment does not exists.');
      return;
    }

    const applicationProps = environments[environment];

    const { layersStack } = applicationProps;
    const layerCreated = {};

    // Iterate through each layer in the stack
    layersStack.map(({ name, provide, env, dependencies }) => {
      // Generate a unique stack name for the current layer
      const CORE_STACK_NAME = createName(name, applicationProps);
      const config = { ...applicationProps };

      if (env) {
        config.env = env;
      }

      config.layersCreated = layerCreated;

      // Create an instance of the current layer and store it in layerCreated object
      layerCreated[name] = new provide(this.app, CORE_STACK_NAME, config);

      if (dependencies) {
        // Add dependencies to the current layer
        dependencies.map((dependenceName) =>
          layerCreated[name].addDependency(layerCreated[dependenceName]),
        );
      }
    });
  }

  public synth() {
    // Generate CloudFormation templates and artifacts
    this.app.synth();
  }
}
