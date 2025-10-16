import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string
if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables")
}

const options: any = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise


