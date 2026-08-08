import express from "express";
import multer from "multer";
import { signup, login, refresh, logout, logoutAll, checkAuth, updateProfile, } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "../lib/validators.js";
import { loginLimiter, signupLimiter } from "../middlewares/rateLimiter.js";
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
const router = express.Router();
router.post("/signup", signupLimiter, validateBody(signupSchema), signup);
router.post("/login", loginLimiter, validateBody(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/logout-all", protectRoute, logoutAll);
router.get("/check", protectRoute, checkAuth);
router.put("/update-profile", protectRoute, upload.single("profilePic"), updateProfile);
export default router;
//# sourceMappingURL=auth.route.js.map