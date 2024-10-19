import { Resource } from "sst";
import { ApiGatewayManagementApiClient, DeleteConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { DynamoDBClient, PutItemCommand, GetItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import type { APIGatewayProxyHandler } from "aws-lambda";
import publishSocketMessages from "../utils/publishSocketMessages";
import scanTable from "../utils/scanTable";

const TOPIC_MESSAGES = "messages";
const TOPIC_USERS = "users";

const dynamoClient = new DynamoDBClient();
const socketClient = new ApiGatewayManagementApiClient({ endpoint: Resource.socket.managementEndpoint });

export const connect: APIGatewayProxyHandler = async (event) => {
  const connectionId = event.requestContext.connectionId!;
  const username = event.queryStringParameters!.username ?? "";
  console.log(`!!! connect ${connectionId}`, { event });

  await dynamoClient.send(
    new PutItemCommand({
      TableName: Resource.Connections.name,
      Item: {
        id: { S: connectionId },
        username: { S: username },
        expireAt: { N: (Date.now() / 1000 + 3600).toString() },
      },
    })
  );

  const connections = await scanTable(dynamoClient, Resource.Connections.name);
  await publishSocketMessages({
    client: socketClient,
    connectionIds: connections.map((c) => c.id.S!),
    topic: TOPIC_USERS,
    data: [...new Set(connections.map((c) => c.username.S))],
  });

  return { statusCode: 200, body: JSON.stringify({ session_established: true }) };
};

export const disconnect: APIGatewayProxyHandler = async (event) => {
  const connectionId = event.requestContext.connectionId!;
  console.log(`!!! disconnect ${connectionId}`);
  await dynamoClient.send(
    new DeleteItemCommand({
      TableName: Resource.Connections.name,
      Key: {
        id: { S: connectionId },
      },
    })
  );

  const connections = await scanTable(dynamoClient, Resource.Connections.name);
  await publishSocketMessages({
    client: socketClient,
    connectionIds: connections.map((c) => c.id.S!),
    topic: TOPIC_USERS,
    data: [...new Set(connections.map((c) => c.username.S))],
  });

  return { statusCode: 200, body: JSON.stringify({ session_removed: true }) };
};

export const catchAll: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("!!! default", { event });
    const connectionId = event.requestContext.connectionId!;
    const response = await dynamoClient.send(
      new GetItemCommand({
        TableName: Resource.Connections.name,
        Key: {
          id: { S: connectionId },
        },
      })
    );

    const username = response?.Item?.username.S;
    if (username == null) {
      socketClient.send(
        new DeleteConnectionCommand({
          ConnectionId: connectionId,
        })
      );
      return { statusCode: 400, body: "invalid connection" };
    }

    const connections = await scanTable(dynamoClient, Resource.Connections.name);
    await publishSocketMessages({
      client: socketClient,
      connectionIds: connections.map((c) => c.id.S!),
      topic: TOPIC_MESSAGES,
      data: {
        username,
        message: event.body,
      },
    });

    return { statusCode: 200, body: "" };
  } catch (error: any) {
    return { statusCode: 500, body: `${error?.message}` };
  }
};
