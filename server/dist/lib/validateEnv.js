const requiredEnvVars = ["JWT_SECRET", "CLIENT_URL"];
export const validateEnv = () => {
    const missing = requiredEnvVars.filter((key) => !process.env[key]);
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        missing.push("MONGO_URI");
    }
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        throw new Error("JWT_SECRET is too weak. Use at least 32 random characters.");
    }
};
//# sourceMappingURL=validateEnv.js.map