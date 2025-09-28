import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

let uri: string;
if (process.env.NODE_ENV === "production") {
  uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
} else {
  uri = "mongodb://localhost:27017/";
}

export default async function dbConfig() {
  if (connection.isConnected) {
    return;
  }

  // Skip database connection during build time
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return;
  }

  try {
    const db = await mongoose.connect(uri, {
      dbName: "syncure",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: process.env.NODE_ENV === 'production' ? true : false,
    });

    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.warn('Database connection failed during build:', error);
    // Don't throw error during build time
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
}