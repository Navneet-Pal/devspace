import mongoose, { Schema } from "mongoose";

import { IWorkspace } from "./types.js";
import {
  WORKSPACE_DESCRIPTION,
  WORKSPACE_NAME,
  WORKSPACE_SLUG,
} from "./constants.js";

const WorkspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: WORKSPACE_NAME.MIN_LENGTH,
      maxlength: WORKSPACE_NAME.MAX_LENGTH,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: WORKSPACE_SLUG.MIN_LENGTH,
      maxlength: WORKSPACE_SLUG.MAX_LENGTH,
    },

    description: {
      type: String,
      trim: true,
      maxlength: WORKSPACE_DESCRIPTION.MAX_LENGTH,
      default: "",
    },

    avatar: {
      publicId: {
        type: String,
        default: null,
      },

      url: {
        type: String,
        default: null,
      },
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    /*
     * Soft-delete timestamp.
     *
     * Keep this name consistent everywhere:
     * repository, service and queries all use
     * `deletedAt`.
     */
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
 * Indexes
 */
WorkspaceSchema.index({ slug: 1 }, { unique: true });

WorkspaceSchema.index({
  ownerId: 1,
});

WorkspaceSchema.index({
  deletedAt: 1,
});

WorkspaceSchema.index({
  createdAt: -1,
});

export const Workspace = mongoose.model<IWorkspace>(
  "Workspace",
  WorkspaceSchema,
);
