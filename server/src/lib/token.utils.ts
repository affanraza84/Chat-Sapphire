import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Response } from "express";
import RefreshToken from "../models/refreshToken.model.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export const generateAccessToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not configured");
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = async (userId: string): Promise<string> => {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  await RefreshToken.create({ token, userId, expiresAt });
  return token;
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh", 
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
};
