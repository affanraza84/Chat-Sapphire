import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    req.query = result.data as unknown as typeof req.query;
    next();
  };