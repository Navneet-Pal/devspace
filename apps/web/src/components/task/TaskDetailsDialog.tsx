"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Trash2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { useAuthStore } from "@/store/auth";

import { useProjectMembers } from "@/hooks/projectMember/useProjectMember";
import { useDeleteTask } from "@/hooks/task/useTask";
import { useTaskComments } from "@/hooks/comment/useComment";

import { commentKeys } from "@/services/comment/keys";
import { taskKeys } from "@/services/task/keys";

import type { ProjectRole } from "@/services/projectMember/types";
import type { Task } from "@/services/task/types";

import {
  hasProjectPermission,
  PROJECT_PERMISSION,
} from "@/utils/projectPermission";

import { EditTaskDialog } from "./EditTaskDialog";

import { CommentList } from "@/components/comment/CommentList";
import { CommentComposer } from "@/components/comment/CommentComposer";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { useTaskActivity } from "@/hooks/activity/useActivity";
import { activityKeys } from "@/services/activity/keys";

interface TaskDetailsDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  projectId: string;
}

const priorityVariant = {
  LOW: "secondary",
  MEDIUM: "outline",
  HIGH: "destructive",
  URGENT: "destructive",
} as const;

const priorityLabel = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
} as const;

const statusLabel = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
} as const;

export const TaskDetailsDialog = ({
  task,
  open,
  onOpenChange,
  workspaceId,
  projectId,
}: TaskDetailsDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const { data: projectMembersData } = useProjectMembers(
    workspaceId,
    projectId,
  );

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useTaskComments(workspaceId, projectId, task?._id ?? "");

  const {
    data: taskActivityData,
    isLoading: isTaskActivityLoading,
    isError: isTaskActivityError,
  } = useTaskActivity(workspaceId, projectId, task?._id ?? "");

  const projectMembers = projectMembersData?.data ?? [];
  const comments = commentsData?.data ?? [];
  const taskActivities = taskActivityData?.data ?? [];

  const currentProjectMember = user
    ? projectMembers.find((member) => member.userId._id === user._id)
    : undefined;

  const projectRole: ProjectRole | undefined = currentProjectMember?.role;

  const canEditTask =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.TASK_UPDATE);

  const canDeleteTask =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.TASK_DELETE);

  const canCreateComment =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.COMMENT_CREATE);

  const deleteTask = useDeleteTask();

  if (!task) {
    return null;
  }

  const handleDelete = () => {
    if (!canDeleteTask) {
      return;
    }

    setIsDeleting(true);

    deleteTask.mutate(
      {
        workspaceId,
        projectId,
        taskId: task._id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: taskKeys.projectList(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: taskKeys.workspaceList(workspaceId),
          });

          queryClient.removeQueries({
            queryKey: taskKeys.detail(workspaceId, projectId, task._id),
          });

          queryClient.removeQueries({
            queryKey: commentKeys.taskList(workspaceId, projectId, task._id),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          setIsDeleting(false);
          setDeleteOpen(false);
          onOpenChange(false);
        },

        onError: () => {
          setIsDeleting(false);
        },
      },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 sm:max-w-xl">
          {/* Header */}
          <div className="border-b px-6 py-5">
            <DialogHeader>
              <div className="flex items-start justify-between gap-4 pr-6">
                <div className="min-w-0 space-y-2">
                  <DialogTitle className="text-xl font-semibold leading-7">
                    {task.title}
                  </DialogTitle>

                  <DialogDescription>
                    Task details and information
                  </DialogDescription>
                </div>

                <Badge
                  variant={priorityVariant[task.priority]}
                  className="shrink-0"
                >
                  {priorityLabel[task.priority]}
                </Badge>
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="space-y-6 px-6 py-5">
            {/* Description */}
            <section>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-foreground">
                {task.description || "No description provided."}
              </p>
            </section>

            {/* Status */}
            <section>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </p>

              <div className="mt-2">
                <Badge variant="outline">{statusLabel[task.status]}</Badge>
              </div>
            </section>

            {/* Metadata */}
            <section className="grid gap-5 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
              {/* Assignee */}
              <div>
                <p className="text-xs text-muted-foreground">Assignee</p>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>

                  <span className="truncate text-sm font-medium">
                    {task.assignedTo ? task.assignedTo.name : "Unassigned"}
                  </span>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <p className="text-xs text-muted-foreground">Due date</p>

                <div className="mt-2 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm font-medium">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date"}
                  </span>
                </div>
              </div>

              {/* Created */}
              <div>
                <p className="text-xs text-muted-foreground">Created</p>

                <p className="mt-2 text-sm font-medium">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Updated */}
              <div>
                <p className="text-xs text-muted-foreground">Last updated</p>

                <p className="mt-2 text-sm font-medium">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </section>

            {/* Comments */}
            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="text-sm font-semibold">Comments</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Discuss this task with your team.
                </p>
              </div>

              <CommentList
                comments={comments}
                workspaceId={workspaceId}
                projectId={projectId}
                taskId={task._id}
                isLoading={isCommentsLoading}
                isError={isCommentsError}
              />

              {canCreateComment ? (
                <CommentComposer
                  workspaceId={workspaceId}
                  projectId={projectId}
                  taskId={task._id}
                />
              ) : (
                <p className="text-xs text-muted-foreground">
                  You don't have permission to add comments.
                </p>
              )}
            </section>

            {/* Activity */}
            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="text-sm font-semibold">Activity</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  History of changes made to this task.
                </p>
              </div>

              <ActivityFeed
                activities={taskActivities}
                isLoading={isTaskActivityLoading}
                isError={isTaskActivityError}
              />
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t bg-muted/10 px-6 py-4">
            {canDeleteTask ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                disabled={isDeleting || deleteTask.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>

              {canEditTask && (
                <EditTaskDialog
                  workspaceId={workspaceId}
                  projectId={projectId}
                  task={task}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                "{task.title}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTask.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteTask.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTask.isPending ? "Deleting..." : "Delete Task"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
