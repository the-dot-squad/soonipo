import mongoose from "mongoose";

const globalForMongoose = globalThis;

if (!globalForMongoose.mongo) {
  globalForMongoose.mongo = { conn: null, promise: null };
}

const cached = globalForMongoose.mongo;

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGO_URI environment variable.");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 30_000,
        maxPoolSize: 10,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
