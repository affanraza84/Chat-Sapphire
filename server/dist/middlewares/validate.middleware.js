export const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: "Invalid input",
            errors: result.error.flatten().fieldErrors,
        });
        return;
    }
    req.body = result.data; // sanitized/parsed data
    next();
};
//# sourceMappingURL=validate.middleware.js.map