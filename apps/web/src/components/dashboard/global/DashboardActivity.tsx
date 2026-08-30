"use client";

import { formatDistanceToNow } from "date-fns";
import { Activity as ActivityIcon, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DashboardActivity as DashboardActivityType } from "@/services/dashboard/types";

interface DashboardActivityProps {
  activities: DashboardActivityType[];
  onActivityClick?: (activity: DashboardActivityType) => void;
}

const getStringMetadata = (metadata: Record<string, unknown>, key: string) => {
  const value = metadata[key];

  return typeof value === "string" && value.trim().length > 0 ? value : null;
};

const getNestedStringMetadata = (
  metadata: Record<string, unknown>,
  parentKey: string,
  childKey: string,
) => {
  const parent = metadata[parentKey];

  if (!parent || typeof parent !== "object" || Array.isArray(parent)) {
    return null;
  }

  const value = (parent as Record<string, unknown>)[childKey];

  return typeof value === "string" && value.trim().length > 0 ? value : null;
};

const formatStatus = (value: string) => {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getActivityMessage = (activity: DashboardActivityType) => {
  const actor = activity.actorId.name;
  const metadata = activity.metadata ?? {};

  const taskTitle =
    getStringMetadata(metadata, "taskTitle") ??
    getStringMetadata(metadata, "title");

  const documentTitle =
    getStringMetadata(metadata, "documentTitle") ??
    getStringMetadata(metadata, "title");

  const projectName =
    getStringMetadata(metadata, "projectName") ??
    getStringMetadata(metadata, "name");

  const fileName = getStringMetadata(metadata, "fileName");

  const memberName = getStringMetadata(metadata, "memberName");

  const from = getStringMetadata(metadata, "from");

  const to = getStringMetadata(metadata, "to");

  const updatedTaskTitle = getNestedStringMetadata(
    metadata,
    "changes",
    "title",
  );

  const updatedDocumentTitle = getNestedStringMetadata(
    metadata,
    "changes",
    "title",
  );

  const updatedProjectName = getNestedStringMetadata(
    metadata,
    "changes",
    "name",
  );

  switch (activity.type) {
    case "TASK_CREATED":
      return taskTitle
        ? `${actor} created task "${taskTitle}"`
        : `${actor} created a task`;

    case "TASK_UPDATED":
      if (taskTitle) {
        return `${actor} updated task "${taskTitle}"`;
      }

      if (updatedTaskTitle) {
        return `${actor} updated task "${updatedTaskTitle}"`;
      }

      return `${actor} updated a task`;

    case "TASK_STATUS_CHANGED":
      if (taskTitle && from && to) {
        return (
          <span className="flex flex-wrap items-center gap-1.5">
            <span>
              {actor} changed status of "{taskTitle}"
            </span>

            <span className="font-medium">{formatStatus(from)}</span>

            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

            <span className="font-medium">{formatStatus(to)}</span>
          </span>
        );
      }

      return taskTitle
        ? `${actor} changed status of "${taskTitle}"`
        : `${actor} changed task status`;

    case "TASK_PRIORITY_CHANGED":
      if (taskTitle && from && to) {
        return (
          <span className="flex flex-wrap items-center gap-1.5">
            <span>
              {actor} changed priority of "{taskTitle}"
            </span>

            <span className="font-medium">{formatStatus(from)}</span>

            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

            <span className="font-medium">{formatStatus(to)}</span>
          </span>
        );
      }

      return taskTitle
        ? `${actor} changed priority of "${taskTitle}"`
        : `${actor} changed task priority`;

    case "TASK_ASSIGNED":
      return taskTitle
        ? `${actor} assigned task "${taskTitle}"`
        : `${actor} assigned a task`;

    case "TASK_UNASSIGNED":
      return taskTitle
        ? `${actor} unassigned task "${taskTitle}"`
        : `${actor} unassigned a task`;

    case "TASK_MOVED":
      return taskTitle
        ? `${actor} moved task "${taskTitle}"`
        : `${actor} moved a task`;

    case "TASK_DELETED":
      return taskTitle
        ? `${actor} deleted task "${taskTitle}"`
        : `${actor} deleted a task`;

    case "COMMENT_CREATED":
      return taskTitle
        ? `${actor} commented on "${taskTitle}"`
        : `${actor} added a comment`;

    case "COMMENT_UPDATED":
      return taskTitle
        ? `${actor} edited a comment on "${taskTitle}"`
        : `${actor} edited a comment`;

    case "COMMENT_DELETED":
      return taskTitle
        ? `${actor} deleted a comment on "${taskTitle}"`
        : `${actor} deleted a comment`;

    case "PROJECT_CREATED":
      return projectName
        ? `${actor} created project "${projectName}"`
        : `${actor} created a project`;

    case "PROJECT_UPDATED":
      if (projectName) {
        return `${actor} updated project "${projectName}"`;
      }

      if (updatedProjectName) {
        return `${actor} updated project "${updatedProjectName}"`;
      }

      return `${actor} updated a project`;

    case "MEMBER_ADDED":
      return memberName
        ? `${actor} added ${memberName} to the project`
        : `${actor} added a project member`;

    case "MEMBER_REMOVED":
      return memberName
        ? `${actor} removed ${memberName} from the project`
        : `${actor} removed a project member`;

    case "MEMBER_ROLE_CHANGED":
      if (memberName && from && to) {
        return (
          <span className="flex flex-wrap items-center gap-1.5">
            <span>
              {actor} changed {memberName}'s role
            </span>

            <span className="font-medium">{formatStatus(from)}</span>

            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

            <span className="font-medium">{formatStatus(to)}</span>
          </span>
        );
      }

      return memberName
        ? `${actor} changed ${memberName}'s role`
        : `${actor} changed a member's role`;

    case "DOCUMENT_CREATED":
      return documentTitle
        ? `${actor} created document "${documentTitle}"`
        : `${actor} created a document`;

    case "DOCUMENT_UPDATED":
      if (documentTitle) {
        return `${actor} updated document "${documentTitle}"`;
      }

      if (updatedDocumentTitle) {
        return `${actor} updated document "${updatedDocumentTitle}"`;
      }

      return `${actor} updated a document`;

    case "DOCUMENT_DELETED":
      return documentTitle
        ? `${actor} deleted document "${documentTitle}"`
        : `${actor} deleted a document`;

    case "FILE_UPLOADED":
      return fileName
        ? `${actor} uploaded file "${fileName}"`
        : `${actor} uploaded a file`;

    case "FILE_DELETED":
      return fileName
        ? `${actor} deleted file "${fileName}"`
        : `${actor} deleted a file`;

    default:
      return `${actor} performed an activity`;
  }
};

const isClickableActivity = (activity: DashboardActivityType) => {
  if (activity.taskId) {
    return true;
  }

  return [
    "PROJECT_CREATED",
    "PROJECT_UPDATED",
    "DOCUMENT_CREATED",
    "DOCUMENT_UPDATED",
    "DOCUMENT_DELETED",
    "FILE_UPLOADED",
    "FILE_DELETED",
    "MEMBER_ADDED",
    "MEMBER_REMOVED",
    "MEMBER_ROLE_CHANGED",
  ].includes(activity.type);
};

export const DashboardActivity = ({
  activities,
  onActivityClick,
}: DashboardActivityProps) => {
  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-muted-foreground" />

          <CardTitle>Recent Activity</CardTitle>
        </div>

        <p className="text-sm text-muted-foreground">
          Latest activity across your workspaces.
        </p>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => {
              const clickable =
                !!onActivityClick && isClickableActivity(activity);

              const content = (
                <>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {activity.actorId.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-5">
                      {getActivityMessage(activity)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </>
              );

              if (clickable) {
                return (
                  <button
                    key={activity._id}
                    type="button"
                    onClick={() => onActivityClick?.(activity)}
                    className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent/40"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <div
                  key={activity._id}
                  className="flex items-start gap-3 rounded-lg p-2"
                >
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
