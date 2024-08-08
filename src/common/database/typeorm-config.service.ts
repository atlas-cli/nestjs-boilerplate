import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AuroraPostgresConnectionOptions } from 'typeorm/driver/aurora-postgres/AuroraPostgresConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    if(this.configService.get<string>('database.type') === 'aurora-postgres') {
      return {
        type: this.configService.get<string>('database.type'),
        database: this.configService.get<string>('database.name'),
        secretArn: this.configService.get<string>('database.secretArn'),
        resourceArn: this.configService.get<string>('database.resourceArn'),
        region: this.configService.get<string>('aws.region'),
      } as AuroraPostgresConnectionOptions;
    }

    return {
      type: this.configService.get('database.type'),
      url: this.configService.get('database.url'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
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
