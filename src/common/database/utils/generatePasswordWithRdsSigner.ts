import { Signer } from '@aws-sdk/rds-signer';

export const generatePasswordWithRdsSigner = async () => {
  const configSigner = {
    region: process.env.AWS_REGION ?? 'us-east-1',
    hostname: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USER,
  };
  const signer = new Signer(configSigner);
  const password = (await signer.getAuthToken());
  return password;
};
