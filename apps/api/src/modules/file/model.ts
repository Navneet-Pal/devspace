import { Schema, model } from "mongoose";

import type { IFile } from "./types.js";

const fileSchema = new Schema<IFile>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    secureUrl: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      required: true,
      enum: ["image", "raw", "video"],
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
      min: 0,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

fileSchema.index({
  projectId: 1,
  createdAt: -1,
});

export const File = model<IFile>("File", fileSchema);
