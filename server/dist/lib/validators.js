import { z } from "zod";
export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z.string().min(1, "Password is required").max(100),
});
export const signupSchema = z.object({
    fullName: z.string().trim().min(2, "Full name is too short").max(50),
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100)
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
});
export const sendMessageSchema = z
    .object({
    text: z.string().trim().min(1).max(2000).optional(),
    image: z
        .string()
        .refine((val) => val.startsWith("data:image/"), {
        message: "Image must be a valid base64 data URL",
    })
        .refine((val) => val.length < 7_000_000, {
        message: "Image is too large (max ~5MB)",
    })
        .optional()
        .nullable(),
})
    .refine((data) => data.text || data.image, {
    message: "Either text or image is required",
});
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(30),
});
//# sourceMappingURL=validators.js.map