import { Types } from "mongoose";

export enum NotificationType {
  TASK_ASSIGNED = "TASK_ASSIGNED",
  TASK_STATUS_CHANGED = "TASK_STATUS_CHANGED",
  TASK_PRIORITY_CHANGED = "TASK_PRIORITY_CHANGED",
  TASK_COMMENTED = "TASK_COMMENTED",

  PROJECT_CREATED = "PROJECT_CREATED",
  PROJECT_UPDATED = "PROJECT_UPDATED",

  MEMBER_ADDED = "MEMBER_ADDED",
  MEMBER_REMOVED = "MEMBER_REMOVED",
  MEMBER_ROLE_CHANGED = "MEMBER_ROLE_CHANGED",

  INVITATION_RECEIVED = "INVITATION_RECEIVED",
  INVITATION_ACCEPTED = "INVITATION_ACCEPTED",
  INVITATION_REJECTED = "INVITATION_REJECTED",

  DOCUMENT_CREATED = "DOCUMENT_CREATED",
  DOCUMENT_UPDATED = "DOCUMENT_UPDATED",

  FILE_UPLOADED = "FILE_UPLOADED",
}

export interface CreateNotificationInput {
  userId: Types.ObjectId;
  workspaceId?: Types.ObjectId;
  projectId?: Types.ObjectId;
  taskId?: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationQuery {
  isRead?: boolean;
}

export interface NotificationListOptions {
  page?: number;
  limit?: number;
}
