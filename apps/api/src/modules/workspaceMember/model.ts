import mongoose, { Schema } from "mongoose";
import { IWorkspaceMember } from "./types.js";
import { ROLES } from "../../constants/roles.js";

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
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
    versionKey: false,
  },
);

// A user can be a member of a workspace only once.
workspaceMemberSchema.index(
  {
    workspaceId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

// Get all members of a workspace.
workspaceMemberSchema.index({
  workspaceId: 1,
});

// Get all workspaces of a user.
workspaceMemberSchema.index({
  userId: 1,
});

export const WorkspaceMember = mongoose.model<IWorkspaceMember>(
  "WorkspaceMember",
  workspaceMemberSchema,
);
