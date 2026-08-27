"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuthStore } from "@/store/auth";

import { useProjectMembers } from "@/hooks/projectMember/useProjectMember";

import {
  useUpdateTask,
  useUpdateTaskAssignee,
  useUpdateTaskPriority,
  useUpdateTaskStatus,
} from "@/hooks/task/useTask";

import { taskKeys } from "@/services/task/keys";

import type { ProjectRole } from "@/services/projectMember/types";

import type { Task, TaskPriority, TaskStatus } from "@/services/task/types";

import {
  hasProjectPermission,
  PROJECT_PERMISSION,
} from "@/utils/projectPermission";
import { activityKeys } from "@/services/activity/keys";

interface EditTaskDialogProps {
  workspaceId: string;
  projectId: string;
  task: Task;
}

export const EditTaskDialog = ({
  workspaceId,
  projectId,
  task,
}: EditTaskDialogProps) => {
  const [open, setOpen] = useState(false);

  const user = useAuthStore((state) => state.user);

  const [title, setTitle] = useState(task.title);

  const [description, setDescription] = useState(task.description ?? "");

  const [status, setStatus] = useState<TaskStatus>(task.status);

  const [priority, setPriority] = useState<TaskPriority>(task.priority);

  const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id ?? "");

  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.slice(0, 10) : "",
  );

  const queryClient = useQueryClient();

  const updateTask = useUpdateTask();

  const updateTaskStatus = useUpdateTaskStatus();

  const updateTaskPriority = useUpdateTaskPriority();

  const updateTaskAssignee = useUpdateTaskAssignee();

  const { data: projectMembersData, isLoading: isProjectMembersLoading } =
    useProjectMembers(workspaceId, projectId);

  const projectMembers = projectMembersData?.data ?? [];

  const currentProjectMember = user
    ? projectMembers.find((member) => member.userId._id === user._id)
    : undefined;

  const projectRole: ProjectRole | undefined = currentProjectMember?.role;

  const canEditTask =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.TASK_UPDATE);

  const canChangeStatus =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.TASK_CHANGE_STATUS);

  const canChangePriority =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.TASK_CHANGE_PRIORITY);

  const canAssignTask =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.TASK_ASSIGN);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(task.title);
    setDescription(task.description ?? "");
    setStatus(task.status);
    setPriority(task.priority);
    setAssignedTo(task.assignedTo?._id ?? "");
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
  }, [open, task]);

  const isSaving =
    updateTask.isPending ||
    updateTaskStatus.isPending ||
    updateTaskPriority.isPending ||
    updateTaskAssignee.isPending;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !canEditTask) {
      return;
    }

    try {
      const requests: Promise<unknown>[] = [];

      const titleChanged = title.trim() !== task.title;

      const descriptionChanged =
        description.trim() !== (task.description ?? "");

      const newDueDate = dueDate ? new Date(dueDate).toISOString() : null;

      const currentDueDate = task.dueDate
        ? new Date(task.dueDate).toISOString()
        : null;

      const dueDateChanged = newDueDate !== currentDueDate;

      if (titleChanged || descriptionChanged || dueDateChanged) {
        requests.push(
          updateTask.mutateAsync({
            workspaceId,
            projectId,
            taskId: task._id,
            data: {
              ...(titleChanged && {
                title: title.trim(),
              }),

              ...(descriptionChanged && {
                description: description.trim() || undefined,
              }),

              ...(dueDateChanged && {
                dueDate: newDueDate,
              }),
            },
          }),
        );
      }

      if (canChangeStatus && status !== task.status) {
        requests.push(
          updateTaskStatus.mutateAsync({
            workspaceId,
            projectId,
            taskId: task._id,
            data: {
              status,
            },
          }),
        );
      }

      if (canChangePriority && priority !== task.priority) {
        requests.push(
          updateTaskPriority.mutateAsync({
            workspaceId,
            projectId,
            taskId: task._id,
            data: {
              priority,
            },
          }),
        );
      }

      const originalAssigneeId = task.assignedTo?._id ?? null;

      const newAssigneeId = assignedTo || null;

      if (canAssignTask && newAssigneeId !== originalAssigneeId) {
        requests.push(
          updateTaskAssignee.mutateAsync({
            workspaceId,
            projectId,
            taskId: task._id,
            data: {
              assignedTo: newAssigneeId,
            },
          }),
        );
      }

      if (requests.length === 0) {
        setOpen(false);
        return;
      }

      await Promise.all(requests);

      queryClient.invalidateQueries({
        queryKey: taskKeys.projectList(workspaceId, projectId),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.workspaceList(workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(workspaceId, projectId, task._id),
      });

      queryClient.invalidateQueries({
        queryKey: activityKeys.projectList(workspaceId, projectId),
      });

      queryClient.invalidateQueries({
        queryKey: activityKeys.taskList(workspaceId, projectId, task._id),
      });

      setOpen(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  if (!canEditTask) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline">Edit</Button>} />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>

          <DialogDescription>Update the task details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Task title</label>

            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>

            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>

            <Select
              value={status}
              onValueChange={(value: string | null) => {
                if (value !== null && canChangeStatus) {
                  setStatus(value as TaskStatus);
                }
              }}
              disabled={!canChangeStatus}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="TODO">Todo</SelectItem>

                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>

                <SelectItem value="IN_REVIEW">In Review</SelectItem>

                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>

            <Select
              value={priority}
              onValueChange={(value: string | null) => {
                if (value !== null && canChangePriority) {
                  setPriority(value as TaskPriority);
                }
              }}
              disabled={!canChangePriority}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>

                <SelectItem value="MEDIUM">Medium</SelectItem>

                <SelectItem value="HIGH">High</SelectItem>

                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Assignee</label>

            <Select
              value={assignedTo}
              onValueChange={(value: string | null) => {
                if (value !== null && canAssignTask) {
                  setAssignedTo(value === "unassigned" ? "" : value);
                }
              }}
              disabled={!canAssignTask || isProjectMembersLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !canAssignTask
                      ? "You cannot change assignee"
                      : isProjectMembersLoading
                        ? "Loading members..."
                        : "Select an assignee"
                  }
                >
                  {(value: string | null) => {
                    if (!value) {
                      return "Unassigned";
                    }

                    const selectedMember = projectMembers.find(
                      (member) => member.userId._id === value,
                    );

                    return selectedMember?.userId.name ?? "Unassigned";
                  }}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>

                {projectMembers.map((member) => (
                  <SelectItem key={member.userId._id} value={member.userId._id}>
                    {member.userId.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Due date</label>

            <Input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!title.trim() || isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
