import { DataSource, DataSourceOptions } from 'typeorm';
import databaseConfig from '../config/database.config';

const config = databaseConfig();
export const AppDataSource = new DataSource({
  type: config.type,
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.name,
  synchronize: false,
  dropSchema: false,
  keepConnectionAlive: false,
  logging: true,
  ssl: config.sslEnabled,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  cli: {
    entitiesDir: 'dist',
    migrationsDir: 'dist/database/migrations',
    subscribersDir: 'subscriber',
  },
  extra: config.sslEnabled
    ? {
        sslmode: 'verify-full',
        sslrootcert: __dirname + '/certs/rds-combined-ca-bundle.pem',
      }
    : {},
} as DataSourceOptions);
