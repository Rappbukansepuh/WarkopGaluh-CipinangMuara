import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailureTime: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  lastFailureTime: 0,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

// Fast failover cooldown: If connection failed recently, fail fast in 0ms without hanging the server
const RECONNECT_COOLDOWN_MS = 15000;

export async function connectToDatabase() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI belum diatur di environment variable (.env.local)');
  }

  // Return existing active connection immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Circuit breaker: Fail fast if failed in the last 15 seconds
  const now = Date.now();
  if (now - cached.lastFailureTime < RECONNECT_COOLDOWN_MS) {
    throw new Error('Database connection in cooldown (circuit breaker active)');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 800, // 800ms fast-fail to prevent long render hangs
      connectTimeoutMS: 800,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      cached.lastFailureTime = 0;
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    cached.lastFailureTime = Date.now();
    throw e;
  }
}

export default connectToDatabase;
