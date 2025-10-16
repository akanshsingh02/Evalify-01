import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in environment variables")
}

interface GlobalWithMongoose {
  mongooseConn?: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

const globalForMongoose = global as unknown as GlobalWithMongoose

let cached = globalForMongoose.mongooseConn
if (!cached) {
  cached = globalForMongoose.mongooseConn = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}


