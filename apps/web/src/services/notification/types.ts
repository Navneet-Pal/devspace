export interface Notification {
  _id: string;
  userId: string;
  workspaceId?: string | null;
  projectId?: string | null;
  taskId?: string | null;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsParams {
  isRead?: boolean;
  page?: number;
  limit?: number;
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetUnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message: string;
  data: Notification;
}

export interface MarkAllNotificationsReadResponse {
  success: boolean;
  message: string;
  data: {
    modifiedCount: number;
  };
}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
  data: Notification;
}

export interface DeleteAllNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    deletedCount: number;
  };
}
