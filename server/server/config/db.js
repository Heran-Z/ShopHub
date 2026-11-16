
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DATABASE:", mongoose.connection.name);
console.log("COLLECTION:", mongoose.connection.collection("users").collectionName);
console.log("HOST:", mongoose.connection.host);
    


    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
