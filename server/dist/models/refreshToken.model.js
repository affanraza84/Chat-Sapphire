import mongoose, { Schema } from "mongoose";
const refreshTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});
// MongoDB TTL index — expired tokens deletes automatically after the specified time
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model("RefreshToken", refreshTokenSchema);
//# sourceMappingURL=refreshToken.model.js.map