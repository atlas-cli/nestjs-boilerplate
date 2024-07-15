import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { createName } from '../utils/create-name';

export const createSessionsTable = (scope, applicationProps) => {
  const TABLE_NAME = createName('oidc-sessions', applicationProps);

  const sessions = new Table(scope, TABLE_NAME, {
    partitionKey: {
      name: 'modelId',
      type: AttributeType.STRING,
    },
    timeToLiveAttribute: 'expiresAt',
    tableName: TABLE_NAME,
  });

  sessions.addGlobalSecondaryIndex({
    indexName: 'uidIndex',
    partitionKey: {
      name: 'uid',
      type: AttributeType.STRING,
    },
  });

  sessions.addGlobalSecondaryIndex({
    indexName: 'grantIdIndex',
    partitionKey: {
      name: 'grantId',
      type: AttributeType.STRING,
    },
  });

  sessions.addGlobalSecondaryIndex({
    indexName: 'userCodeIndex',
    partitionKey: {
      name: 'userCode',
      type: AttributeType.STRING,
    },
  });
  return sessions;
};
