import mongoose, { Schema } from "mongoose";
import { IWorkspace } from "./types.js";

const WorkspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const Workspace = mongoose.model<IWorkspace>("Workspace" , WorkspaceSchema);