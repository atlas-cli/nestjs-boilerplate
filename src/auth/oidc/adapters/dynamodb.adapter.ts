import { Adapter, AdapterPayload } from 'oidc-provider';
import { DynamoDB } from 'aws-sdk';

const TABLE_NAME = process.env.SESSIONS_TABLE_NAME;
const TABLE_REGION = process.env.AWS_REGION;

const dynamoClient = new DynamoDB.DocumentClient({
  region: TABLE_REGION,
});

export class DynamoDBAdapter implements Adapter {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async upsert(
    id: string,
    payload: AdapterPayload,
    expiresIn?: number,
  ): Promise<void> {
    // DynamoDB can recognise TTL values only in seconds
    const expiresAt = expiresIn
      ? Math.floor(Date.now() / 1000) + expiresIn
      : null;

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: TABLE_NAME,
      Key: { modelId: this.name + '-' + id },
      UpdateExpression:
        'SET payload = :payload' +
        (expiresAt ? ', expiresAt = :expiresAt' : '') +
        (payload.userCode ? ', userCode = :userCode' : '') +
        (payload.uid ? ', uid = :uid' : '') +
        (payload.grantId ? ', grantId = :grantId' : ''),
      ExpressionAttributeValues: {
        ':payload': payload,
        ...(expiresAt ? { ':expiresAt': expiresAt } : {}),
        ...(payload.userCode ? { ':userCode': payload.userCode } : {}),
        ...(payload.uid ? { ':uid': payload.uid } : {}),
        ...(payload.grantId ? { ':grantId': payload.grantId } : {}),
      },
    };

    await dynamoClient.update(params).promise();
  }

  async find(id: string): Promise<AdapterPayload | undefined> {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: TABLE_NAME,
      Key: { modelId: this.name + '-' + id },
      ProjectionExpression: 'payload, expiresAt',
    };

    const result = <
      { payload: AdapterPayload; expiresAt?: number } | undefined
    >(await dynamoClient.get(params).promise()).Item;

    // DynamoDB can take upto 48 hours to drop expired items, so a check is required
    if (!result || (result.expiresAt && Date.now() > result.expiresAt * 1000)) {
      return undefined;
    }
    return result.payload;
  }

  async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: TABLE_NAME,
      IndexName: 'userCodeIndex',
      KeyConditionExpression: 'userCode = :userCode',
      ExpressionAttributeValues: {
        ':userCode': userCode,
      },
      Limit: 1,
      ProjectionExpression: 'payload, expiresAt',
    };

    const result = <
      { payload: AdapterPayload; expiresAt?: number } | undefined
    >(await dynamoClient.query(params).promise()).Items?.[0];

    // DynamoDB can take upto 48 hours to drop expired items, so a check is required
    if (!result || (result.expiresAt && Date.now() > result.expiresAt * 1000)) {
      return undefined;
    }

    return result.payload;
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: TABLE_NAME,
      IndexName: 'uidIndex',
      KeyConditionExpression: 'uid = :uid',
      ExpressionAttributeValues: {
        ':uid': uid,
      },
      Limit: 1,
      ProjectionExpression: 'payload, expiresAt',
    };

    const result = <
      { payload: AdapterPayload; expiresAt?: number } | undefined
    >(await dynamoClient.query(params).promise()).Items?.[0];

    // DynamoDB can take upto 48 hours to drop expired items, so a check is required
    if (!result || (result.expiresAt && Date.now() > result.expiresAt * 1000)) {
      return undefined;
    }

    return result.payload;
  }

  async consume(id: string): Promise<void> {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: TABLE_NAME,
      Key: { modelId: this.name + '-' + id },
      UpdateExpression: 'SET #payload.#consumed = :value',
      ExpressionAttributeNames: {
        '#payload': 'payload',
        '#consumed': 'consumed',
      },
      ExpressionAttributeValues: {
        ':value': Math.floor(Date.now() / 1000),
      },
      ConditionExpression: 'attribute_exists(modelId)',
    };

    await dynamoClient.update(params).promise();
  }

  async destroy(id: string): Promise<void> {
    const params: DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: TABLE_NAME,
      Key: { modelId: this.name + '-' + id },
    };

    await dynamoClient.delete(params).promise();
  }

  async revokeByGrantId(grantId: string): Promise<void> {
    let ExclusiveStartKey: DynamoDB.DocumentClient.Key | undefined = undefined;

    do {
      const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: TABLE_NAME,
        IndexName: 'grantIdIndex',
        KeyConditionExpression: 'grantId = :grantId',
        ExpressionAttributeValues: {
          ':grantId': grantId,
        },
        ProjectionExpression: 'modelId',
        Limit: 25,
        ExclusiveStartKey,
      };

      const queryResult = await dynamoClient.query(params).promise();
      ExclusiveStartKey = queryResult.LastEvaluatedKey;

      const items = <{ modelId: string }[] | undefined>queryResult.Items;

      if (!items || !items.length) {
        return;
      }

      const batchWriteParams: DynamoDB.DocumentClient.BatchWriteItemInput = {
        RequestItems: {
          [TABLE_NAME]: items.reduce<DynamoDB.DocumentClient.WriteRequests>(
            (acc, item) => [
              ...acc,
              { DeleteRequest: { Key: { modelId: item.modelId } } },
            ],
            [],
          ),
        },
      };

      await dynamoClient.batchWrite(batchWriteParams).promise();
    } while (ExclusiveStartKey);
  }
}
