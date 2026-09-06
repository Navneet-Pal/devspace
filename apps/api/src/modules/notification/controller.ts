import type { Request, Response } from "express";

import { StatusCode } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";

import { notificationService } from "./service.js";
import { notificationIdSchema, notificationQuerySchema } from "./validation.js";

class NotificationController {
  async getNotifications(req: Request, res: Response) {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized.");
    }

    const query = notificationQuerySchema.parse(req.query);

    const result = await notificationService.getNotifications(
      userId.toString(),
      {
        isRead: query.isRead,
      },
      {
        page: query.page,
        limit: query.limit,
      },
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Notifications fetched successfully.",
      data: result,
    });
  }

  async getUnreadCount(req: Request, res: Response) {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized.");
    }

    const count = await notificationService.getUnreadCount(userId.toString());

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Unread notification count fetched successfully.",
      data: {
        count,
      },
    });
  }

  async markAsRead(req: Request, res: Response) {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized.");
    }

    const { notificationId } = notificationIdSchema.parse(req.params);

    const notification = await notificationService.markAsRead(
      notificationId,
      userId.toString(),
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  }

  async markAllAsRead(req: Request, res: Response) {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized.");
    }

    const result = await notificationService.markAllAsRead(userId.toString());

    return res.status(StatusCode.OK).json({
      success: true,
      message: "All notifications marked as read.",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  }

  async deleteNotification(req: Request, res: Response) {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized.");
    }

    const { notificationId } = notificationIdSchema.parse(req.params);

    const notification = await notificationService.deleteNotification(
      notificationId,
      userId.toString(),
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Notification deleted successfully.",
      data: notification,
    });
  }

  async deleteAllNotifications(req: Request, res: Response) {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(StatusCode.UNAUTHORIZED, "Unauthorized.");
    }

    const result = await notificationService.deleteAllNotifications(
      userId.toString(),
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "All notifications deleted successfully.",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  }
}

export const notificationController = new NotificationController();
