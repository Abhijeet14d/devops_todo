import mongoose from "mongoose";

export const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error", error);
        throw error;
    }
};