import { StatusCode } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";

import { notificationRepository } from "./repository.js";
import type {
  CreateNotificationInput,
  NotificationListOptions,
  NotificationQuery,
} from "./types.js";

class NotificationService {
  async createNotification(data: CreateNotificationInput) {
    return notificationRepository.create(data);
  }

  async createNotifications(data: CreateNotificationInput[]) {
    return notificationRepository.createMany(data);
  }

  async getNotifications(
    userId: string,
    query: NotificationQuery = {},
    options: NotificationListOptions = {},
  ) {
    return notificationRepository.findByUserId(userId, query, options);
  }

  async getUnreadCount(userId: string) {
    return notificationRepository.countUnread(userId);
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await notificationRepository.markAsRead(
      notificationId,
      userId,
    );

    if (!notification) {
      throw new ApiError(StatusCode.NOT_FOUND, "Notification not found.");
    }

    return notification;
  }

  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await notificationRepository.deleteById(
      notificationId,
      userId,
    );

    if (!notification) {
      throw new ApiError(StatusCode.NOT_FOUND, "Notification not found.");
    }

    return notification;
  }

  async deleteAllNotifications(userId: string) {
    return notificationRepository.deleteAllByUserId(userId);
  }
}

export const notificationService = new NotificationService();
