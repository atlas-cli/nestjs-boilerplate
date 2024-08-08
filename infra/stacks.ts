import { BastionStack } from './stacks/bastion-stack';
import { CoreStack } from './stacks/core-stack';
import { PipelineRoleStack } from './stacks/pipeline-stack';
import { ApplicationStack } from './stacks/application-stack';

export const stacks = [
  { name: 'CoreStack', provide: CoreStack },
  {
    name: 'PipelineStack',
    provide: PipelineRoleStack,
    dependencies: ['CoreStack'],
  },
  {
    name: 'ApplicationStack',
    provide: ApplicationStack,
    dependencies: ['CoreStack'],
  },
  // {
  //   name: 'BastionStack',
  //   provide: BastionStack,
  //   dependencies: ['CoreStack'],
  // },
  // {
  //   name: 'ClientsStack',
  //   provide: ClientsStack,
  //   dependencies: ['CoreStack'],
  // }
];