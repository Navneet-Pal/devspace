export const notificationKeys = {
  all: ["notifications"] as const,

  list: (params?: { isRead?: boolean; page?: number; limit?: number }) =>
    [...notificationKeys.all, "list", params] as const,

  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};
