import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();   // ✅ ye line add karo (IMPORTANT)

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI); // debug

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error connecting MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;