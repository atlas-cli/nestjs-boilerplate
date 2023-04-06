import { App } from 'aws-cdk-lib';
import { ApplicationProps } from '../props/application.props';
import { createName } from './../utils/create-name';

export class AtlasInfraestructure {
  app: App;
  constructor(config: ApplicationProps) {
    // application
    this.app = new App();

    // core layer
    const CORE_STACK_NAME = createName('core-layer', config);
    const coreStack = new config.layersStack.core(
      this.app,
      CORE_STACK_NAME,
      config,
    );

    // application layer
    const APPLICATION_STACK_NAME = createName('application-layer', config);
    const applicationStack = new config.layersStack.application(
      this.app,
      APPLICATION_STACK_NAME,
      config,
    );

    // dependencies
    applicationStack.addDependency(coreStack);
  }
  public synth() {
    // run synth
    this.app.synth();
  }
}
