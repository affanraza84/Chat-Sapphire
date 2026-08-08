import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// MongoDB TTL index — expired tokens deletes automatically after the specified time
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema,
);
