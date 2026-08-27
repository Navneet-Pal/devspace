import { Types } from "mongoose";

export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const TASK_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

export interface ITask {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  createdBy: Types.ObjectId;
  assignedTo: Types.ObjectId | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  position: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  assignedTo?: Types.ObjectId | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
  position?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: Date | null;
}

export interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface PopulatedTask extends Omit<ITask, "assignedTo"> {
  assignedTo: PopulatedUser | null;
}
