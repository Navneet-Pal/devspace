"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { TaskDetailsDialog } from "@/components/task/TaskDetailsDialog";

import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { useTask } from "@/hooks/task/useTask";

import type {
  DashboardActivity,
  DashboardTask,
} from "@/services/dashboard/types";

import { DashboardActivity as DashboardActivityCard } from "./DashboardActivity";
import { DashboardStats } from "./DashboardStats";
import { DashboardTasks } from "./DashboardTasks";
import { DashboardUpcoming } from "./DashboardUpcoming";
import { DashboardWorkspaces } from "./DashboardWorkspaces";

export const GlobalDashboard = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useDashboard();

  const [selectedTask, setSelectedTask] = useState<DashboardTask | null>(null);

  const {
    data: taskResponse,
    isLoading: isTaskLoading,
    isError: isTaskError,
  } = useTask(
    selectedTask?.workspaceId ?? "",
    selectedTask?.projectId ?? "",
    selectedTask?._id ?? "",
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-destructive">Failed to load dashboard.</p>
      </div>
    );
  }

  const dashboard = data.data;

  const handleTaskClick = (task: DashboardTask) => {
    setSelectedTask(task);
  };

  const handleTaskDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedTask(null);
    }
  };

  const handleActivityClick = (activity: DashboardActivity) => {
    /*
     * Task / comment activities
     * → open the existing task details dialog.
     */
    if (activity.taskId) {
      setSelectedTask({
        _id: activity.taskId,
        workspaceId: activity.workspaceId,
        projectId: activity.projectId,
        projectName: "",
        title: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: null,
      });

      return;
    }

    /*
     * Project activities
     */
    if (
      activity.type === "PROJECT_CREATED" ||
      activity.type === "PROJECT_UPDATED"
    ) {
      router.push(
        `/dashboard/workspaces/${activity.workspaceId}/projects/${activity.projectId}`,
      );

      return;
    }

    /*
     * Document activities
     */
    if (
      activity.type === "DOCUMENT_CREATED" ||
      activity.type === "DOCUMENT_UPDATED" ||
      activity.type === "DOCUMENT_DELETED"
    ) {
      const documentId =
        typeof activity.metadata?.documentId === "string"
          ? activity.metadata.documentId
          : null;

      if (documentId) {
        router.push(
          `/dashboard/workspaces/${activity.workspaceId}/projects/${activity.projectId}/documentation/${documentId}`,
        );
      } else {
        router.push(
          `/dashboard/workspaces/${activity.workspaceId}/projects/${activity.projectId}/documentation`,
        );
      }

      return;
    }

    /*
     * File activities
     */
    if (activity.type === "FILE_UPLOADED" || activity.type === "FILE_DELETED") {
      router.push(
        `/dashboard/workspaces/${activity.workspaceId}/projects/${activity.projectId}/files`,
      );

      return;
    }

    /*
     * Member activities
     */
    if (
      activity.type === "MEMBER_ADDED" ||
      activity.type === "MEMBER_REMOVED" ||
      activity.type === "MEMBER_ROLE_CHANGED"
    ) {
      router.push(`/dashboard/workspaces/${activity.workspaceId}/members`);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <DashboardStats stats={dashboard.stats} />

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardTasks
            tasks={dashboard.myTasks}
            onTaskClick={handleTaskClick}
          />

          <DashboardUpcoming
            tasks={dashboard.upcomingTasks}
            onTaskClick={handleTaskClick}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardActivityCard
            activities={dashboard.recentActivity}
            onActivityClick={handleActivityClick}
          />

          <DashboardWorkspaces workspaces={dashboard.workspaces} />
        </div>
      </div>

      {selectedTask && (
        <TaskDetailsDialog
          task={taskResponse?.data ?? null}
          open={!!selectedTask}
          onOpenChange={handleTaskDialogChange}
          workspaceId={selectedTask.workspaceId}
          projectId={selectedTask.projectId}
        />
      )}

      {selectedTask && (isTaskLoading || isTaskError) && (
        <div className="sr-only">
          {isTaskLoading
            ? "Loading task details..."
            : "Failed to load task details."}
        </div>
      )}
    </>
  );
};
