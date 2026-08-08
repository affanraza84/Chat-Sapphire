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

    // Mutate req.query in-place to avoid TypeError (it is a getter-only property on modern IncomingMessage)
    for (const key of Object.keys(req.query)) {
      delete req.query[key];
    }
    Object.assign(req.query, result.data);
    next();
  };