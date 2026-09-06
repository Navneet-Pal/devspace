import { Types } from "mongoose";

import { Notification } from "./model.js";
import type {
  CreateNotificationInput,
  NotificationListOptions,
  NotificationQuery,
} from "./types.js";

export const notificationRepository = {
  async create(data: CreateNotificationInput) {
    return Notification.create(data);
  },

  async createMany(data: CreateNotificationInput[]) {
    if (data.length === 0) {
      return [];
    }

    return Notification.insertMany(data);
  },

  async findById(notificationId: string) {
    return Notification.findById(notificationId);
  },

  async findByUserId(
    userId: string,
    query: NotificationQuery = {},
    options: NotificationListOptions = {},
  ) {
    const page = Math.max(options.page ?? 1, 1);
    const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    };

    if (query.isRead !== undefined) {
      filter.isRead = query.isRead;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),

      Notification.countDocuments(filter),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async countUnread(userId: string) {
    return Notification.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false,
    });
  },

  async markAsRead(notificationId: string, userId: string) {
    return Notification.findOneAndUpdate(
      {
        _id: notificationId,
        userId: new Types.ObjectId(userId),
      },
      {
        $set: {
          isRead: true,
        },
      },
      {
        new: true,
      },
    );
  },

  async markAllAsRead(userId: string) {
    return Notification.updateMany(
      {
        userId: new Types.ObjectId(userId),
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );
  },

  async deleteById(notificationId: string, userId: string) {
    return Notification.findOneAndDelete({
      _id: notificationId,
      userId: new Types.ObjectId(userId),
    });
  },

  async deleteAllByUserId(userId: string) {
    return Notification.deleteMany({
      userId: new Types.ObjectId(userId),
    });
  },
};
