/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "vjschat",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "ap-southeast-3",
        },
      },
    };
  },
  async run() {
    const table = new sst.aws.Dynamo("Connections", {
      fields: { id: "string" },
      primaryIndex: { hashKey: "id" },
      ttl: "expireAt",
    });

    const socket = new sst.aws.ApiGatewayWebSocket("socket");
    socket.route("$connect", {
      handler: "packages/lambda.connect",
      link: [socket, table],
    });
    socket.route("$disconnect", {
      handler: "packages/lambda.disconnect",
      link: [socket, table],
    });
    socket.route("$default", {
      handler: "packages/lambda.catchAll",
      link: [socket, table],
    });

    const web = new sst.aws.Nuxt("web", {
      link: [socket, table],
    });

    return {
      tableName: table.name,
      webUrl: web.url,
      socketUrl: socket.url,
    };
  },
});
