import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// Ensure properly typed cached container on the global object
type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};
const _global = global as any;
let cached: Cached = _global.mongoose as Cached;

if (!cached) {
  cached = { conn: null, promise: null };
  _global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // avoid shadowing the imported `mongoose` identifier
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}

// Extend global namespace for TypeScript
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}
