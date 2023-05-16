import { LambdaServerFactory } from './../common/factories/lambda-server.factory';
import { SubscriptionsServerModule } from './server.module';

export const handler = LambdaServerFactory.create(SubscriptionsServerModule);
