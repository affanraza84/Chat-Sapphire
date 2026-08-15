import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
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
}, { timestamps: true });
export default mongoose.model("User", userSchema);
//# sourceMappingURL=user.model.js.map