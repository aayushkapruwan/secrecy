import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function connectToDatabase(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI as string;

    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }

    const db = await mongoose.connect(MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.error("Error while connecting to database", error);
    throw error; // Let the calling API route handle it
  }
}

export default connectToDatabase;
