import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { validateEnv } from "./lib/validateEnv.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
validateEnv();

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = [
  clientUrl,
  clientUrl && !clientUrl.startsWith("http") ? `http://${clientUrl}` : null,
  clientUrl && !clientUrl.startsWith("http") ? `https://${clientUrl}` : null,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow requests in dev mode
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["set-cookie"],
  }),
);
app.use(generalLimiter);
app.set("trust proxy", 1);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/messages", messageRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  },
);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
