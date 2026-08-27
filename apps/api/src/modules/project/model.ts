import mongoose, { Types } from "mongoose";
import { IProject, PROJECT_STATUS } from "./types.js";

export const projectSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.ACTIVE,
      required: true,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Get all projects of a workspace
projectSchema.index({
  workspaceId: 1,
});

// Prevent duplicate project names inside the same workspace
projectSchema.index(
  {
    workspaceId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

// Get projects created by a user
projectSchema.index({
  createdBy: 1,
});

export const Project = mongoose.model<IProject>("Project", projectSchema);
