import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.js";
import type { Request, Response, NextFunction } from "express";

const { TokenExpiredError, JsonWebTokenError } = jwt;

interface DecodedToken extends JwtPayload {
  userId: string;
}

function isDecodedToken(payload: unknown): payload is DecodedToken {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "userId" in payload &&
    typeof (payload as Record<string, unknown>).userId === "string"
  );
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const bearerHeader = req.headers.authorization;
    const bearerToken = bearerHeader?.toLowerCase().startsWith("bearer ")
      ? bearerHeader.split(" ")[1]
      : undefined;

    const token = req.cookies?.accessToken || bearerToken;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token missing",
        error: "NOT_AUTHENTICATED",
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!isDecodedToken(payload)) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload",
        error: "MALFORMED_TOKEN",
      });
      return;
    }

    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Not authorized - user not found",
        error: "USER_NOT_FOUND",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Access token expired",
        error: "ACCESS_TOKEN_EXPIRED",
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
        error: "INVALID_TOKEN",
      });
      return;
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
