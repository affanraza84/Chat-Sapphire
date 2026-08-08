import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
export declare const validateQuery: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validateQuery.middleware.d.ts.map