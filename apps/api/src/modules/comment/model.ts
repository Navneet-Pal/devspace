import { Schema, model } from "mongoose";

import type { IComment } from "./types.js";

const commentSchema = new Schema<IComment>(
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

    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
      index: true,
    },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

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

commentSchema.index({
  projectId: 1,
  createdAt: -1,
});

commentSchema.index({
  taskId: 1,
  createdAt: -1,
});

export const Comment = model<IComment>("Comment", commentSchema);
