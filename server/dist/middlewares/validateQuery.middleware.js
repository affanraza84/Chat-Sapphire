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
    // Mutate req.query in-place to avoid TypeError (it is a getter-only property on modern IncomingMessage)
    for (const key of Object.keys(req.query)) {
        delete req.query[key];
    }
    Object.assign(req.query, result.data);
    next();
};
//# sourceMappingURL=validateQuery.middleware.js.map