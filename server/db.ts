import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

export async function connectDB() {
  if (!MONGO_URI) {
    console.error("WARNING: MONGODB_URI or MONGO_URI environment variable is missing.");
    console.error("Please add your MongoDB Atlas URL to the .env file.");
    console.error("Falling back to local mongodb://localhost:277017/bloom_petal if available...");
  }

  const uri = MONGO_URI || "mongodb://localhost:27017/bloom_petal";

  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB database.");
  } catch (error) {
    console.error("Database connection failed:", error);
    console.error("The server is still running. Please verify your MongoDB configuration in .env.");
  }
}
