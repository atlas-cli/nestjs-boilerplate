import { LambdaServerFactory } from './../common/factories/lambda-server.factory';
import { AuthServerModule } from './server.module';

export const handler = LambdaServerFactory.create(AuthServerModule);
