import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
            .select("-password -failedLoginAttempts -lockUntil")
            .lean();
        res.status(200).json({ success: true, users: filteredUsers });
    }
    catch (error) {
        console.error("getUsersForSidebar error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: "INTERNAL_ERROR",
        });
    }
};
export const getMessages = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const userToChatId = req.params.id;
        if (!userToChatId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
                error: "MISSING_USER_ID",
            });
            return;
        }
        const myId = req.user._id;
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("senderId", "fullName profilePic")
            .populate("receiverId", "fullName profilePic")
            .lean();
        res.status(200).json({
            success: true,
            messages: messages.reverse(),
            pagination: { page, limit },
        });
    }
    catch (error) {
        console.error("getMessages error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: "INTERNAL_ERROR",
        });
    }
};
export const sendMessage = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const receiverId = req.params.id;
        if (!receiverId) {
            res.status(400).json({
                success: false,
                message: "Receiver ID is required",
                error: "MISSING_RECEIVER_ID",
            });
            return;
        }
        const { text, image } = req.body;
        const senderId = req.user._id;
        if (receiverId === senderId.toString()) {
            res.status(400).json({
                success: false,
                message: "You cannot message yourself",
                error: "INVALID_RECEIVER",
            });
            return;
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            res.status(404).json({
                success: false,
                message: "Receiver not found",
                error: "RECEIVER_NOT_FOUND",
            });
            return;
        }
        let imageUrl;
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    folder: "chat-images",
                    resource_type: "image",
                });
                imageUrl = uploadResponse.secure_url;
            }
            catch (uploadError) {
                console.error("Image upload error:", uploadError);
                res.status(500).json({
                    success: false,
                    message: "Failed to upload image",
                    error: "IMAGE_UPLOAD_FAILED",
                });
                return;
            }
        }
        const messagePayload = {
            senderId,
            receiverId,
        };
        if (text)
            messagePayload["text"] = text;
        if (imageUrl)
            messagePayload["image"] = imageUrl;
        const newMessage = await Message.create(messagePayload);
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json({ success: true, message: newMessage });
    }
    catch (error) {
        console.error("sendMessage error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: "INTERNAL_ERROR",
        });
    }
};
//# sourceMappingURL=message.controller.js.map