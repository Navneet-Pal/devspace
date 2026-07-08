import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email:string;
    password:string;
    avatar:string;
    isVerified:boolean;
    refreshToken:string | null;
    createdAt:Date;
    updatedAt:Date;
}