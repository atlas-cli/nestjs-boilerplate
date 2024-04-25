import { Adapter, AdapterPayload } from 'oidc-provider';
import { BatchWriteItemCommand, BatchWriteItemInput, DeleteItemCommand, DeleteItemInput, DynamoDBClient, GetItemCommand, GetItemInput, ListBackupsCommand, QueryCommand, QueryInput, UpdateItemCommand, UpdateItemInput } from "@aws-sdk/client-dynamodb";

const TABLE_NAME = process.env.SESSIONS_TABLE_NAME;
const TABLE_REGION = process.env.AWS_REGION;

const dynamoClient = new DynamoDBClient({
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

    const params: UpdateItemInput = {
      TableName: TABLE_NAME,
      Key: { modelId: { S: this.name + '-' + id } },
      UpdateExpression:
        'SET payload = :payload' +
        (expiresAt ? ', expiresAt = :expiresAt' : '') +
        (payload.userCode ? ', userCode = :userCode' : '') +
        (payload.uid ? ', uid = :uid' : '') +
        (payload.grantId ? ', grantId = :grantId' : ''),
      ExpressionAttributeValues: {
        ':payload': { S: JSON.stringify(payload) }, // convert payload to string
        ...(expiresAt ? { ':expiresAt': { N: expiresAt.toString() } } : {}),
        ...(payload.userCode ? { ':userCode': { S: payload.userCode } } : {}),
        ...(payload.uid ? { ':uid': { S: payload.uid } } : {}),
        ...(payload.grantId ? { ':grantId': { S: payload.grantId } } : {}),
      },
    };
    const command = new UpdateItemCommand(params);

    await dynamoClient.send(command);
  }

  async find(id: string): Promise<AdapterPayload | undefined> {
    const params: GetItemInput = {
      TableName: TABLE_NAME,
      Key: { modelId: { S: this.name + '-' + id } },
      ProjectionExpression: 'payload, expiresAt',
    };
    const command = new GetItemCommand(params);


    const result = <
      { payload?: string; expiresAt?: number } | undefined
      >(await dynamoClient.send(command)).Item;

    const payload: AdapterPayload = result.payload ? JSON.parse(result.payload) : undefined;


    // DynamoDB can take upto 48 hours to drop expired items, so a check is required
    if (!result || (result.expiresAt && Date.now() > result.expiresAt * 1000)) {
      return undefined;
    }
    return payload;
  }

  async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
    const params: QueryInput = {
      TableName: TABLE_NAME,
      IndexName: 'userCodeIndex',
      KeyConditionExpression: 'userCode = :userCode',
      ExpressionAttributeValues: {
        ':userCode': { S: userCode },
      },
      Limit: 1,
      ProjectionExpression: 'payload, expiresAt',
    };

    const command = new QueryCommand(params);

    const result = <
      { payload?: string; expiresAt?: number } | undefined
      >(await dynamoClient.send(command)).Items?.[0];

    const payload: AdapterPayload = result.payload ? JSON.parse(result.payload) : undefined;

    // DynamoDB can take upto 48 hours to drop expired items, so a check is required
    if (!result || (result.expiresAt && Date.now() > result.expiresAt * 1000)) {
      return undefined;
    }

    return payload;
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined> {
    const params: QueryInput = {
      TableName: TABLE_NAME,
      IndexName: 'uidIndex',
      KeyConditionExpression: 'uid = :uid',
      ExpressionAttributeValues: {
        ':uid': { S: uid },
      },
      Limit: 1,
      ProjectionExpression: 'payload, expiresAt',
    };
    const command = new QueryCommand(params);

    const result = <
      { payload?: string; expiresAt?: number } | undefined
      >(await dynamoClient.send(command)).Items?.[0];

    const payload: AdapterPayload = result.payload ? JSON.parse(result.payload) : undefined;

    // DynamoDB can take upto 48 hours to drop expired items, so a check is required
    if (!result || (result.expiresAt && Date.now() > result.expiresAt * 1000)) {
      return undefined;
    }

    return payload;
  }

  async consume(id: string): Promise<void> {
    const params: UpdateItemInput = {
      TableName: TABLE_NAME,
      Key: { modelId: { S: this.name + '-' + id } },
      UpdateExpression: 'SET #payload.#consumed = :value',
      ExpressionAttributeNames: {
        '#payload': 'payload',
        '#consumed': 'consumed',
      },
      ExpressionAttributeValues: {
        ':value': { N: Math.floor(Date.now() / 1000).toString() },
      },
      ConditionExpression: 'attribute_exists(modelId)',
    };

    const command = new UpdateItemCommand(params);

    await dynamoClient.send(command);
  }

  async destroy(id: string): Promise<void> {
    const params: DeleteItemInput = {
      TableName: TABLE_NAME,
      Key: { modelId: {S: this.name + '-' + id} },
    };
    const command = new DeleteItemCommand(params);

    await dynamoClient.send(command);
  }

  async revokeByGrantId(grantId: string): Promise<void> {
    let ExclusiveStartKey: any | undefined = undefined;

    do {
      const params: QueryInput = {
        TableName: TABLE_NAME,
        IndexName: 'grantIdIndex',
        KeyConditionExpression: 'grantId = :grantId',
        ExpressionAttributeValues: {
          ':grantId': {S: grantId},
        },
        ProjectionExpression: 'modelId',
        Limit: 25,
        ExclusiveStartKey,
      };
      const command = new QueryCommand(params);

      const queryResult = await dynamoClient.send(command);
      ExclusiveStartKey = queryResult.LastEvaluatedKey;

      const items = <{ modelId?: string }[] | undefined>queryResult.Items;

      if (!items || !items.length) {
        return;
      }

      const batchWriteParams: BatchWriteItemInput = {
        RequestItems: {
          [TABLE_NAME]: items.reduce(
            (acc, item) => [
              ...acc,
              { DeleteRequest: { Key: { modelId: item.modelId } } },
            ],
            [],
          ),
        },
      };

      const commandBatchWrite = new BatchWriteItemCommand(batchWriteParams);
      await dynamoClient.send(commandBatchWrite);
    } while (ExclusiveStartKey);
  }
}
