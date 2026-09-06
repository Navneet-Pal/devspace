import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "@/services/notification/service";
import { notificationKeys } from "@/services/notification/keys";

export const useNotifications = (params?: {
  isRead?: boolean;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationService.getNotifications(params),
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.deleteNotification(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.deleteAllNotifications(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};
