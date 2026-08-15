import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";
const router = express.Router();
// GET /user/:id – returns user profile (including bio & status)
router.get('/:id', protectRoute, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -failedLoginAttempts -lockUntil');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error('User profile fetch error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=user.route.js.map