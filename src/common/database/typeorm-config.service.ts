import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { generatePasswordWithRdsSigner } from './utils/generatePasswordWithRdsSigner';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('database.type'),
      url: this.configService.get('database.url'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: generatePasswordWithRdsSigner,
      database: this.configService.get('database.name'),
      synchronize: this.configService.get('database.synchronize'),
      dropSchema: false,
      keepConnectionAlive: false,
      logging: this.configService.get('app.nodeEnv') !== 'production',
      ssl: this.configService.get('database.sslEnabled'),
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: this.configService.get('database.sslEnabled')
        ? {
            sslmode: 'verify-full',
            sslrootcert: __dirname + '/certs/rds-combined-ca-bundle.pem',
          }
        : {},
    } as PostgresConnectionOptions;
  }
}
