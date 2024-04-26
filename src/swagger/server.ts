import { LambdaServerFactory } from './../common/factories/lambda-server.factory';
import { AppModule } from '../app.module';

export const handler = LambdaServerFactory.create(AppModule);
