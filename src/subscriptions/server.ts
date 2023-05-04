import { AtlasFactory } from '@atlas-org/microservices';
import { SubscriptionsServerModule } from './server.module';

export const handler = AtlasFactory.create(SubscriptionsServerModule);
