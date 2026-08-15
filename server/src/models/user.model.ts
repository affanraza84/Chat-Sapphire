import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  profilePic: string;
  failedLoginAttempts: number;
  lockUntil?: Date | undefined;
  bio?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    bio: { type: String, maxlength: 500, default: "" },
    status: { type: String, maxlength: 500, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
