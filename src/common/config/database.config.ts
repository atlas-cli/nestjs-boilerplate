import { registerAs } from '@nestjs/config';
import * as AWS from 'aws-sdk';

export default registerAs('database', () => {
  const signer = new AWS.RDS.Signer();
  const password = process.env.DATABASE_PASSWORD ?? signer.getAuthToken({
    region: process.env.AWS_REGION,
    hostname: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
  });
  const config = {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    password,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 100,
    sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    ca: process.env.DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
  };
  return config;
});
