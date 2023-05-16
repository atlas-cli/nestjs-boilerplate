import { DynamicModule, Module } from '@nestjs/common';
import {
  AsyncModelFactory,
  ModelDefinition,
  MongooseModule,
} from '@nestjs/mongoose';
import { ConnectionFactory } from 'common/database/factories/connection.factory';

@Module({
  imports: [],
})
export class DatabaseModule {
  public static forRoot(): DynamicModule {
    return MongooseModule.forRootAsync({
      useClass: ConnectionFactory,
    });
  }
  public static forFeature(models: ModelDefinition[]): DynamicModule {
    return MongooseModule.forFeature(models);
  }
  public static forFeatureAsync(models: AsyncModelFactory[]): DynamicModule {
    return MongooseModule.forFeatureAsync(models);
  }
}
