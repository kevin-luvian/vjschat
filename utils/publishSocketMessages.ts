import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

type PublishSocketMessagesOptions = {
  client: ApiGatewayManagementApiClient;
  connectionIds: string[];
  topic: string;
  data: Record<string, any>;
};

export const publishSocketMessages = async (options: PublishSocketMessagesOptions) => {
  const { client, connectionIds, topic, data } = options;
  for (const id of connectionIds) {
    await client
      .send(
        new PostToConnectionCommand({
          ConnectionId: id,
          Data: JSON.stringify({ topic, data }),
        })
      )
      .catch((error) => console.error("Error publishing message to " + id, error));
  }
};

export default publishSocketMessages;
