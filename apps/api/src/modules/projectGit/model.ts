import { Schema, model } from "mongoose";

import type { IProjectGitIntegration } from "./types.js";
import { GIT_PROVIDER } from "./types.js";

const projectGitIntegrationSchema = new Schema<IProjectGitIntegration>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
      index: true,
    },

    provider: {
      type: String,
      enum: Object.values(GIT_PROVIDER),
      required: true,
      default: GIT_PROVIDER.GITHUB,
    },

    installationId: {
      type: Number,
      required: true,
      index: true,
    },

    repositoryId: {
      type: Number,
      default: null,
    },

    repositoryName: {
      type: String,
      default: null,
      trim: true,
    },

    repositoryFullName: {
      type: String,
      default: null,
      trim: true,
    },

    repositoryOwner: {
      type: String,
      default: null,
      trim: true,
    },

    repositoryUrl: {
      type: String,
      default: null,
      trim: true,
    },

    defaultBranch: {
      type: String,
      default: null,
      trim: true,
    },

    connectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

projectGitIntegrationSchema.index({
  projectId: 1,
  provider: 1,
});

export const ProjectGitIntegration = model<IProjectGitIntegration>(
  "ProjectGitIntegration",
  projectGitIntegrationSchema,
);
