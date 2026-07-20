import mongoose from "mongoose";
import { IVerificationToken } from "./types.js";

const VerificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique:true,
      index:true,
    },
    type:{
      type: String,
      enum: ["VERIFY_EMAIL","RESET_PASSWORD"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires:0,
    },
  },
  {
    timestamps: true,
  },
);

export const VerificationToken = mongoose.model<IVerificationToken>(
 "VerificationToken",
  VerificationTokenSchema,
);
