import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("Missing MONGO_URI environment variable");

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Cached on `global` in dev so Turbopack hot-reload doesn't open a fresh
// connection on every reload; a plain singleton in production.
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  global._mongoClientPromise ??= new MongoClient(uri).connect();
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;
