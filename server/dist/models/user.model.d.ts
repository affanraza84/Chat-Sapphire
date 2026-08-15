import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    email: string;
    fullName: string;
    password: string;
    profilePic: string;
    failedLoginAttempts: number;
    lockUntil?: Date | undefined;
    bio?: string;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=user.model.d.ts.map