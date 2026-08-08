import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const signupSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const sendMessageSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
//# sourceMappingURL=validators.d.ts.map