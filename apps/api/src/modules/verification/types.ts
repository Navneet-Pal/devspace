import { Document, Types } from "mongoose";

export type TokenType =
  | "VERIFY_EMAIL"
  | "RESET_PASSWORD";

export interface IVerificationToken extends Document {
  userId: Types.ObjectId;
  token: string;
  type: TokenType;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}