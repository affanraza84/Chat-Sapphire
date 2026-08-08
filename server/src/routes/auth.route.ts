import express from "express";
import {
  signup,
  login,
  refresh,
  logout,
  logoutAll,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "../lib/validators.js";
import { loginLimiter, signupLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/signup", signupLimiter, validateBody(signupSchema), signup);
router.post("/login", loginLimiter, validateBody(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/logout-all", protectRoute, logoutAll);
router.get("/check", protectRoute, checkAuth);

export default router;
