import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from './../common/database/typeorm-config.service';

@Module({
  imports: [],
})
export class DatabaseModule {
  public static forRoot(entities?: any[]): DynamicModule {
    return TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: any) => {
        options.entities = entities;
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    });
  }
}
