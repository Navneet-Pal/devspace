"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowRight, CalendarDays, Circle, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { Activity } from "@/services/activity/types";

interface ActivityItemProps {
  activity: Activity;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const getStringValue = (value: unknown): string | null => {
  return typeof value === "string" ? value : null;
};

const getActivityMessage = (activity: Activity) => {
  const actor = activity.actorId.name;

  switch (activity.type) {
    case "TASK_CREATED": {
      const title = getStringValue(activity.metadata.title);

      return title
        ? `${actor} created task "${title}"`
        : `${actor} created a task`;
    }

    case "TASK_UPDATED":
      return `${actor} updated a task`;

    case "TASK_STATUS_CHANGED": {
      const from = getStringValue(activity.metadata.from);

      const to = getStringValue(activity.metadata.to);

      if (from && to) {
        return (
          <span className="flex items-center gap-1.5">
            <span>{actor} changed status</span>

            <span className="font-medium">{from}</span>

            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />

            <span className="font-medium">{to}</span>
          </span>
        );
      }

      return `${actor} changed task status`;
    }

    case "TASK_PRIORITY_CHANGED": {
      const from = getStringValue(activity.metadata.from);

      const to = getStringValue(activity.metadata.to);

      if (from && to) {
        return (
          <span className="flex items-center gap-1.5">
            <span>{actor} changed priority</span>

            <span className="font-medium">{from}</span>

            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />

            <span className="font-medium">{to}</span>
          </span>
        );
      }

      return `${actor} changed task priority`;
    }

    case "TASK_ASSIGNED": {
      return `${actor} assigned a task`;
    }

    case "TASK_UNASSIGNED":
      return `${actor} unassigned a task`;

    case "TASK_MOVED":
      return `${actor} moved a task`;

    case "TASK_DELETED": {
      const title = getStringValue(activity.metadata.title);

      return title
        ? `${actor} deleted task "${title}"`
        : `${actor} deleted a task`;
    }

    case "COMMENT_CREATED":
      return `${actor} added a comment`;

    case "COMMENT_UPDATED":
      return `${actor} edited a comment`;

    case "COMMENT_DELETED":
      return `${actor} deleted a comment`;

    case "PROJECT_CREATED":
      return `${actor} created the project`;

    case "PROJECT_UPDATED":
      return `${actor} updated the project`;

    case "MEMBER_ADDED":
      return `${actor} added a project member`;

    case "MEMBER_REMOVED":
      return `${actor} removed a project member`;

    case "MEMBER_ROLE_CHANGED":
      return `${actor} changed a member's role`;

    default:
      return `${actor} performed an activity`;
  }
};

export const ActivityItem = ({ activity }: ActivityItemProps) => {
  return (
    <div className="relative flex gap-3">
      <div className="relative flex shrink-0 flex-col items-center">
        <Avatar className="h-8 w-8 border">
          {activity.actorId.avatar && (
            <AvatarImage
              src={activity.actorId.avatar}
              alt={activity.actorId.name}
            />
          )}

          <AvatarFallback>{getInitials(activity.actorId.name)}</AvatarFallback>
        </Avatar>

        <div className="mt-2 h-2 w-2 rounded-full bg-muted-foreground/40" />
      </div>

      <div className="min-w-0 flex-1 pb-5">
        <div className="text-sm text-foreground">
          {getActivityMessage(activity)}
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />

          <span>
            {formatDistanceToNow(new Date(activity.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
