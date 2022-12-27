import { AtlasFactory } from '@atlas-org/microservices';
import { UsersServerModule } from './server.module';

export const handler = AtlasFactory.create(UsersServerModule);
