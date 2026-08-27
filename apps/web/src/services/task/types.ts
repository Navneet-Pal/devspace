import type { ApiResponse } from "@/types/apiTypes";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskAssignee {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  createdBy: string;
  assignedTo: TaskAssignee | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  position: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  projectId?: string;
  title: string;
  description?: string;
  assignedTo?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  position?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string | null;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface UpdateTaskPriorityRequest {
  priority: TaskPriority;
}

export interface UpdateTaskAssigneeRequest {
  assignedTo: string | null;
}

export interface UpdateTaskPositionRequest {
  position: number;
}

export type CreateTaskResponse = ApiResponse<Task>;

export type GetWorkspaceTasksResponse = ApiResponse<Task[]>;

export type GetProjectTasksResponse = ApiResponse<Task[]>;

export type GetTaskResponse = ApiResponse<Task>;

export type UpdateTaskResponse = ApiResponse<Task>;

export type UpdateTaskStatusResponse = ApiResponse<Task>;

export type UpdateTaskPriorityResponse = ApiResponse<Task>;

export type UpdateTaskAssigneeResponse = ApiResponse<Task>;

export type UpdateTaskPositionResponse = ApiResponse<Task>;

export type DeleteTaskResponse = ApiResponse<null>;
