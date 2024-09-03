import exp from "constants";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connectionState = await mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  if (connectionState === 2) {
    console.log("connecting to MongoDB...");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "nextjsrestapi",
      bufferCommands: true,
    });
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.error("Error connecting to MongoDB: ", error);
    throw new Error("Error connecting to MongoDB...", error);
  }
};

export default connect;
