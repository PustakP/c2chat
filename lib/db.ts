import mongoose from "mongoose";

// s: cached conn in dev
const globalForMongoose = global as unknown as { mongooseConn?: typeof mongoose };

export async function connectMongo() {
  if (globalForMongoose.mongooseConn) return globalForMongoose.mongooseConn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("missing MONGODB_URI");
  await mongoose.connect(uri);
  globalForMongoose.mongooseConn = mongoose;
  return mongoose;
}


