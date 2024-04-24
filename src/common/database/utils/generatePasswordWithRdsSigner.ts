import { Signer } from '@aws-sdk/rds-signer';

export const generatePasswordWithRdsSigner = async () => {
  const signer = new Signer({
    region: process.env.AWS_REGION,
    hostname: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
  });
  return process.env.DATABASE_PASSWORD ?? (await signer.getAuthToken());
};
