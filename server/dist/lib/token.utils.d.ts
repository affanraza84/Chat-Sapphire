import type { Response } from "express";
export declare const generateAccessToken: (userId: string) => string;
export declare const generateRefreshToken: (userId: string) => Promise<string>;
export declare const setAuthCookies: (res: Response, accessToken: string, refreshToken: string) => void;
export declare const clearAuthCookies: (res: Response) => void;
//# sourceMappingURL=token.utils.d.ts.map