import { LambdaServerFactory } from './../common/factories/lambda-server.factory';
import { UsersServerModule } from './server.module';

export const handler = LambdaServerFactory.create(UsersServerModule);
