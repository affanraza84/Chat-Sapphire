export const validateQuery = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: result.error.flatten().fieldErrors,
        });
        return;
    }
    req.query = result.data;
    next();
};
//# sourceMappingURL=validateQuery.middleware.js.map