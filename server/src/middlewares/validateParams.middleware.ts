import type { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "../lib/ObjectId.js";

export const validateObjectIdParam =
  (paramName: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const value = req.params[paramName];

    if (typeof value !== "string" || !value || !isValidObjectId(value)) {
      res.status(400).json({
        success: false,
        message: `Invalid ${paramName}`,
        error: "INVALID_ID",
      });
      return;
    }

    next();
  };
