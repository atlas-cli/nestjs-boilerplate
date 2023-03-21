import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AsyncModelFactory,
  ModelDefinition,
  MongooseModule,
} from '@nestjs/mongoose';

@Module({
  imports: [],
})
export class DatabaseModule {
  public static forRoot(): DynamicModule {
    return MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    });
  }
  public static forFeature(models: ModelDefinition[]): DynamicModule {
    return MongooseModule.forFeature(models);
  }
  public static forFeatureAsync(models: AsyncModelFactory[]): DynamicModule {
    return MongooseModule.forFeatureAsync(models);
  }
}
