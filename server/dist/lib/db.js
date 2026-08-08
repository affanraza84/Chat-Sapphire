import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MongoDB connection URI (MONGO_URI) is not defined.");
        }
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map