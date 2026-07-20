import mongoose, { Schema } from "mongoose";
import { IWorkspaceMember } from "./types.js"; 
import { ROLES } from "../../constants/roles.js";

const WorkspaceMemberSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

WorkspaceMemberSchema.index(
    {
        workspaceId:1,
        userId:1,
    },
    {
        unique : true,
    }
);

export const WorkspaceMember = mongoose.model<IWorkspaceMember>(
  "WorkspaceMember",
  WorkspaceMemberSchema,
);
