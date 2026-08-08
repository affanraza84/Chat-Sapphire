import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { validateQuery } from "../middlewares/validateQuery.middleware.js";
import { validateObjectIdParam } from "../middlewares/validateParams.middleware.js";
import { sendMessageLimiter } from "../middlewares/rateLimiter.js";
import { sendMessageSchema, paginationSchema } from "../lib/validators.js";
import { getUsersForSidebar, getMessages, sendMessage, } from "../controllers/message.controller.js";
const router = express.Router();
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, validateObjectIdParam("id"), validateQuery(paginationSchema), getMessages);
router.post("/send/:id", protectRoute, sendMessageLimiter, validateObjectIdParam("id"), validateBody(sendMessageSchema), sendMessage);
export default router;
//# sourceMappingURL=message.route.js.map