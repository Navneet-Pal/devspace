import { Schema, model } from "mongoose";
import { ITask, TASK_PRIORITY, TASK_STATUS } from "./types.js";

const taskSchema = new Schema<ITask>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TODO,
      required: true,
    },

    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.MEDIUM,
      required: true,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    position: {
      type: Number,
      required: true,
      default: 1000,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({
  projectId: 1,
  status: 1,
  position: 1,
});

taskSchema.index({
  projectId: 1,
  assignedTo: 1,
});

taskSchema.index({
  projectId: 1,
  dueDate: 1,
});

export const Task = model<ITask>("Task", taskSchema);
