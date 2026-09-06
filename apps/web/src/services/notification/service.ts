import { axiosInstance } from "@/lib/axios";

import type {
  GetNotificationsParams,
  GetNotificationsResponse,
  GetUnreadCountResponse,
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  DeleteNotificationResponse,
  DeleteAllNotificationsResponse,
} from "./types";

class NotificationService {
  async getNotifications(
    params?: GetNotificationsParams,
  ): Promise<GetNotificationsResponse> {
    const response = await axiosInstance.get("/v1/notifications", {
      params,
    });

    return response.data;
  }

  async getUnreadCount(): Promise<GetUnreadCountResponse> {
    const response = await axiosInstance.get("/v1/notifications/unread-count");

    return response.data;
  }

  async markAsRead(
    notificationId: string,
  ): Promise<MarkNotificationReadResponse> {
    const response = await axiosInstance.patch(
      `/v1/notifications/${notificationId}/read`,
    );

    return response.data;
  }

  async markAllAsRead(): Promise<MarkAllNotificationsReadResponse> {
    const response = await axiosInstance.patch("/v1/notifications/read-all");

    return response.data;
  }

  async deleteNotification(
    notificationId: string,
  ): Promise<DeleteNotificationResponse> {
    const response = await axiosInstance.delete(
      `/v1/notifications/${notificationId}`,
    );

    return response.data;
  }

  async deleteAllNotifications(): Promise<DeleteAllNotificationsResponse> {
    const response = await axiosInstance.delete("/v1/notifications");

    return response.data;
  }
}

export const notificationService = new NotificationService();
