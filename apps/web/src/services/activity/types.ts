import type { ApiResponse } from "@/types/apiTypes";

export type ActivityType =
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_STATUS_CHANGED"
  | "TASK_PRIORITY_CHANGED"
  | "TASK_ASSIGNED"
  | "TASK_UNASSIGNED"
  | "TASK_MOVED"
  | "TASK_DELETED"
  | "COMMENT_CREATED"
  | "COMMENT_UPDATED"
  | "COMMENT_DELETED"
  | "MEMBER_ADDED"
  | "MEMBER_REMOVED"
  | "MEMBER_ROLE_CHANGED"
  | "DOCUMENT_CREATED"
  | "DOCUMENT_UPDATED"
  | "DOCUMENT_DELETED"
  | "FILE_UPLOADED"
  | "FILE_DELETED";

export interface ActivityActor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Activity {
  _id: string;
  workspaceId: string;
  projectId: string;
  taskId: string | null;
  actorId: ActivityActor;
  type: ActivityType;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export type GetProjectActivityResponse = ApiResponse<Activity[]>;

export type GetTaskActivityResponse = ApiResponse<Activity[]>;
