import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { fetchSecrets } from './../../config/ssm/fetch-secrets';

@Injectable()
export class ConnectionFactory implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    // Get the connection string from the .env or .env.production file
    let connectionString = this.configService.get<string>('database.uri');

    if (this.configService.get<string>('database.secretName')) {
      // Get the access credentials from AWS Secrets Manager
      const secrets = await fetchSecrets(
        this.configService.get<string>('database.secretName'),
      );

      // Safely encode the password to prevent special characters from
      // causing issues in the connection string
      const password = Array.from(secrets.password)
        .map((c: any) =>
          encodeURIComponent(c).replace(
            /[!'()*]/g,
            (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
          ),
        )
        .join('');

      // Generate a new connection string with the Secrets Manager credentials
      connectionString = `mongodb://${secrets.username}:${password}@${secrets.host}:${secrets.port}/database`;

      // Set the SSL connection options for the database connection
      return {
        uri: connectionString,
        ssl: true,
        readPreference: 'secondaryPreferred',
        retryWrites: false,
        sslCA: `${__dirname}/cert/rds-combined-ca-bundle.pem`, // File containing the CA certificate for SSL
      };
    }

    // Return the default connection options if Secrets Manager is not used
    return {
      uri: connectionString,
    };
  }
}
