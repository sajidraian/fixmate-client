import { MongoClient } from "mongodb";
import { setServers } from "node:dns";

setServers(["1.1.1.1", "1.0.0.1"]);

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "fixmate";

if (!uri) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

const client = new MongoClient(uri);

export const db = client.db(dbName);
export { client };