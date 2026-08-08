import mongoose, { Document, Types } from "mongoose";
export interface IMessage extends Document {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    text?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMessage, {}, {}, {}, Document<unknown, {}, IMessage, {}, mongoose.DefaultSchemaOptions> & IMessage & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMessage>;
export default _default;
//# sourceMappingURL=message.model.d.ts.map