import { Schema, model } from "mongoose";

import { ACTIVITY_TYPE, type IActivity } from "./types.js";

const activitySchema = new Schema<IActivity>({
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

  actorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  type: {
    type: String,
    required: true,
    enum: Object.values(ACTIVITY_TYPE),
    index: true,
  },

  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

activitySchema.index({
  projectId: 1,
  createdAt: -1,
});

activitySchema.index({
  taskId: 1,
  createdAt: -1,
});

export const Activity = model<IActivity>("Activity", activitySchema);
