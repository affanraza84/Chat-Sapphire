import mongoose, { Document, Types } from "mongoose";
export interface IRefreshToken extends Document {
    token: string;
    userId: Types.ObjectId;
    expiresAt: Date;
    createdAt: Date;
}
declare const _default: mongoose.Model<IRefreshToken, {}, {}, {}, Document<unknown, {}, IRefreshToken, {}, mongoose.DefaultSchemaOptions> & IRefreshToken & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRefreshToken>;
export default _default;
//# sourceMappingURL=refreshToken.model.d.ts.map