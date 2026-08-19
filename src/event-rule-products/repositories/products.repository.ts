import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ProductCreatedDetail, ProductImage } from '../event-bridge.types';

const client = new DynamoDBClient({ region: process.env.REGION });
const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_PRODUCTS!;

export const putProduct = async (detail: ProductCreatedDetail): Promise<void> => {
  await dynamo.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...detail,
        images: [],
        createdAt: new Date().toISOString(),
      },
    }),
  );
};

export const getProduct = async (tenantId: string, productId: string) => {
  const { Item } = await dynamo.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { tenantId, productId },
    }),
  );
  return Item;
};

export const updateProductImages = async (
  tenantId: string,
  productId: string,
  images: ProductImage[],
): Promise<void> => {
  await dynamo.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { tenantId, productId },
      UpdateExpression: 'SET images = :images, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':images': images,
        ':updatedAt': new Date().toISOString(),
      },
    }),
  );
};
