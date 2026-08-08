import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import cloudinary from "../lib/cloudinary.js";
import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies, } from "../lib/token.utils.js";
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 min
// Valid bcrypt hash of a random string - just to stop timing attack
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8i6bZBTPBEcJdaTCq0RGDwsC4rL5vG";
export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: "Email already exists" });
            return;
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });
        const accessToken = generateAccessToken(newUser._id.toString());
        const refreshToken = await generateRefreshToken(newUser._id.toString());
        setAuthCookies(res, accessToken, refreshToken);
        res.status(201).json({
            success: true,
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            },
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user?.lockUntil && user.lockUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
            res.status(423).json({
                success: false,
                message: `Account locked. Try again in ${minutesLeft} minute(s).`,
                error: "ACCOUNT_LOCKED",
            });
            return;
        }
        const hashToCompare = user?.password ?? DUMMY_HASH;
        const isMatch = await bcrypt.compare(password, hashToCompare);
        if (!user || !isMatch) {
            if (user) {
                user.failedLoginAttempts += 1;
                if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
                    user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
                    user.failedLoginAttempts = 0;
                }
                await user.save();
            }
            res.status(400).json({ success: false, message: "Invalid credentials" });
            return;
        }
        // Successful login - reset lockout state
        if (user.failedLoginAttempts > 0 || user.lockUntil) {
            user.failedLoginAttempts = 0;
            user.lockUntil = undefined;
            await user.save();
        }
        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = await generateRefreshToken(user._id.toString());
        setAuthCookies(res, accessToken, refreshToken);
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const refresh = async (req, res) => {
    try {
        const incomingToken = req.cookies?.refreshToken;
        if (!incomingToken) {
            res.status(401).json({
                success: false,
                message: "Refresh token missing",
                error: "NOT_AUTHENTICATED",
            });
            return;
        }
        const storedToken = await RefreshToken.findOne({ token: incomingToken });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            clearAuthCookies(res);
            res.status(401).json({
                success: false,
                message: "Refresh token invalid or expired, please log in again",
                error: "REFRESH_TOKEN_EXPIRED",
            });
            return;
        }
        await RefreshToken.deleteOne({ _id: storedToken._id });
        const newAccessToken = generateAccessToken(storedToken.userId.toString());
        const newRefreshToken = await generateRefreshToken(storedToken.userId.toString());
        setAuthCookies(res, newAccessToken, newRefreshToken);
        res.status(200).json({ success: true, message: "Token refreshed" });
    }
    catch (error) {
        console.error("Refresh error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const logout = async (req, res) => {
    try {
        const incomingToken = req.cookies?.refreshToken;
        if (incomingToken) {
            await RefreshToken.deleteOne({ token: incomingToken });
        }
        clearAuthCookies(res);
        res.status(200).json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const logoutAll = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        await RefreshToken.deleteMany({ userId: req.user._id });
        clearAuthCookies(res);
        res
            .status(200)
            .json({ success: true, message: "Logged out from all devices" });
    }
    catch (error) {
        console.error("Logout-all error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const checkAuth = (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};
export const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        if (!req.file) {
            res.status(400).json({ success: false, message: "No profile picture provided" });
            return;
        }
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
            folder: "profile-pics",
            resource_type: "image",
        });
        // Update user profile picture in DB
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");
        if (!updatedUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            user: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
                createdAt: updatedUser.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
//# sourceMappingURL=auth.controller.js.map