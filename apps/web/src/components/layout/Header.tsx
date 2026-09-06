"use client";

import { Bell, Check, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks/notification/useNotification";
import { notificationKeys } from "@/services/notification/keys";
import { getSocket } from "@/services/socket/socket";

const formatNotificationTime = (date: string) => {
  const createdAt = new Date(date);
  const now = new Date();

  const diff = now.getTime() - createdAt.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return createdAt.toLocaleDateString();
};

export const Header = () => {
  const queryClient = useQueryClient();

  const { data, isLoading: isNotificationsLoading } = useNotifications({
    page: 1,
    limit: 8,
  });

  const { data: unreadData } = useUnreadNotificationCount();

  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const notifications = data?.data.notifications ?? [];
  const unreadCount = unreadData?.data.count ?? 0;

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      return;
    }

    const handleNewNotification = () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [queryClient]);

  const handleNotificationClick = (notificationId: string) => {
    if (!notificationId) return;

    markAsRead.mutate(notificationId);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <p className="text-sm text-muted-foreground">Welcome back 👋</p>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button size="icon" variant="outline" className="relative">
                <Bell className="h-4 w-4" />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}

                <span className="sr-only">Notifications</span>
              </Button>
            }
          />

          <DropdownMenuContent align="end" className="w-96 p-0">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-semibold">Notifications</p>

                <p className="text-xs text-muted-foreground">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "You're all caught up"}
                </p>
              </div>

              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5"
                  disabled={markAllAsRead.isPending}
                  onClick={() => markAllAsRead.mutate()}
                >
                  {markAllAsRead.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Mark all read
                </Button>
              )}
            </div>

            <DropdownMenuSeparator />

            {isNotificationsLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center px-6 text-center">
                <Bell className="mb-2 h-8 w-8 text-muted-foreground/50" />

                <p className="text-sm font-medium">No notifications</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  You're all caught up.
                </p>
              </div>
            ) : (
              <div className="max-h-[420px] overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification._id}
                    className={`cursor-pointer p-3 ${
                      !notification.isRead ? "bg-muted/50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification._id)}
                  >
                    <div className="flex w-full gap-3">
                      {!notification.isRead && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {notification.message}
                        </p>

                        <p className="mt-1.5 text-[11px] text-muted-foreground">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}

            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />

                <div className="px-4 py-2">
                  <p className="text-center text-xs text-muted-foreground">
                    Showing latest notifications
                  </p>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
