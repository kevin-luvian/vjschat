import { Resource } from "sst";
import { ApiGatewayManagementApiClient, PostToConnectionCommand, DeleteConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { DynamoDBClient, PutItemCommand, GetItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import type { APIGatewayProxyHandler } from "aws-lambda";

const dynamoClient = new DynamoDBClient();
const socketClient = new ApiGatewayManagementApiClient({ endpoint: Resource.socket.managementEndpoint });

export const connect: APIGatewayProxyHandler = async (event) => {
  const connectionId = event.requestContext.connectionId!;
  console.log(`!!! connect ${connectionId}`, { event });

  await dynamoClient.send(
    new PutItemCommand({
      TableName: Resource.Connections.name,
      Item: {
        id: { S: connectionId },
        username: { S: event.queryStringParameters!.username ?? "" },
        expireAt: { N: (Date.now() / 1000 + 3600).toString() },
      },
    })
  );

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
  return { statusCode: 200, body: JSON.stringify({ session_removed: true }) };
};

export const sendMessage: APIGatewayProxyHandler = async (event) => {
  console.log("!!! message", { env: process.env });
  return { statusCode: 200, body: event.body ?? "" };
};

export const catchAll: APIGatewayProxyHandler = async (event) => {
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

  const connection = response.Item;
  if (connection == null) {
    socketClient.send(
      new DeleteConnectionCommand({
        ConnectionId: event.requestContext.connectionId,
      })
    );
    return { statusCode: 400, body: "invalid connection" };
  }

  // Send a message back to the client
  await socketClient.send(
    new PostToConnectionCommand({
      ConnectionId: event.requestContext.connectionId,
      Data: `Hey ${connection.username.S}! What is this? ` + event.body + JSON.stringify(response),
    })
  );

  return { statusCode: 200, body: "" };
};
