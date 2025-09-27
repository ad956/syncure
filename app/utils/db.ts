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

  const db = await mongoose.connect(uri, {
    dbName: "syncure",
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0 // Disable mongoose buffering
  });

  connection.isConnected = db.connections[0].readyState;
}