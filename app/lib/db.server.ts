import { MongoClient, ServerApiVersion } from "mongodb";

const connectionString = process.env.DB_URI || "";

if (!connectionString) {
  throw new Error(
    "No connection string provided. \n\nPlease create a `.env` file in the root of this project. Add a DB_URI variable to that file with the connection string to your MongoDB cluster."
  );
}

let client: MongoClient;

declare global {
  // eslint-disable-next-line
  var __client: MongoClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  client = new MongoClient(connectionString, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
} else {
  if (!global.__client) {
    global.__client = new MongoClient(connectionString, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  client = global.__client;
  console.log(`Database client is ready!`);
}

export { client };
