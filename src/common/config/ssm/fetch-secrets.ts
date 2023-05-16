import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

export const fetchSecrets = async (secretName: string) => {
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
  });
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );
    return JSON.parse(response.SecretString);
  } catch (error) {
    throw error;
  }
};
