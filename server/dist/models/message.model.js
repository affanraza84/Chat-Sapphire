import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    text: { type: String, trim: true, maxlength: 2000 },
    image: { type: String },
}, { timestamps: true });
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
export default mongoose.model("Message", messageSchema);
//# sourceMappingURL=message.model.js.map