import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;

  name: string;

  email: string;

  password: string;

  avatar: string;

  avatarPublicId: string;

  isVerified: boolean;

  refreshToken: string | null;

  createdAt: Date;

  updatedAt: Date;
}
