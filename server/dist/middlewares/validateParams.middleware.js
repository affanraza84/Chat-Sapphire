import { isValidObjectId } from "../lib/ObjectId.js";
export const validateObjectIdParam = (paramName) => (req, res, next) => {
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
//# sourceMappingURL=validateParams.middleware.js.map