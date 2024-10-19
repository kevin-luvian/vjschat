import { DynamoDBClient, ScanCommand, AttributeValue } from "@aws-sdk/client-dynamodb";

export const scanTable = async (dynamoClient: DynamoDBClient, tableName: string) => {
  let params = {
    TableName: tableName,
  } as any;

  let hasNext = true;
  let items: Record<string, AttributeValue>[] = [];
  while (hasNext) {
    try {
      const data = await dynamoClient.send(new ScanCommand(params));
      items = items.concat(data.Items!);
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      hasNext = data.LastEvaluatedKey != null;
    } catch (error) {
      console.error("Error scanning DynamoDB table:", error);
      throw error;
    }
  }

  return items;
};

export default scanTable;
