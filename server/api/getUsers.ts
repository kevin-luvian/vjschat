import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import scanTable from "~/utils/scanTable";

// const DB_NAME = "vjschat-production-ConnectionsTable";
const DB_NAME = Resource.Connections.name;

export default defineEventHandler(async () => {
  const dynamoClient = new DynamoDBClient();
  const users = await scanTable(dynamoClient, DB_NAME);
  const set = new Set(users.map((u) => u.username.S));
  return Array.from(set);
});
