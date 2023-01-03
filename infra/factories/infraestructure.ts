import { App } from 'aws-cdk-lib';
import { ApplicationProps } from '../props/application.props';
import { createName } from './../utils/create-name';

export class AtlasInfraestructure {
  constructor(config: ApplicationProps) {
    // application
    const app = new App();

    // core layer
    const CORE_STACK_NAME = createName('core-layer', config);
    const coreStack = new config.layersStack.core(app, CORE_STACK_NAME, config);

    // application layer
    const APPLICATION_STACK_NAME = createName('application-layer', config);
    const applicationStack = new config.layersStack.application(
      app,
      APPLICATION_STACK_NAME,
      config,
    );

    // dependencies
    applicationStack.addDependency(coreStack);

    // run synth
    app.synth();
  }
}
