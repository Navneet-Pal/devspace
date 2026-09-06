import { Schema, model } from "mongoose";

import type { IProjectGitOAuthState } from "./types.js";

const projectGitOAuthStateSchema = new Schema<IProjectGitOAuthState>(
  {
    state: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

projectGitOAuthStateSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

export const ProjectGitOAuthState = model<IProjectGitOAuthState>(
  "ProjectGitOAuthState",
  projectGitOAuthStateSchema,
);
