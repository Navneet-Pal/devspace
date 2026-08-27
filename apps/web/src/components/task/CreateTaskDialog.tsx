"use client";

import { useState } from "react";
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
import { useCreateProjectTask } from "@/hooks/task/useTask";

import { taskKeys } from "@/services/task/keys";

import type { ProjectRole } from "@/services/projectMember/types";

import type { TaskPriority, TaskStatus } from "@/services/task/types";

import {
  hasProjectPermission,
  PROJECT_PERMISSION,
} from "@/utils/projectPermission";
import { activityKeys } from "@/services/activity/keys";

interface Project {
  _id: string;
  name: string;
}

interface CreateTaskDialogProps {
  workspaceId: string;
  projectId?: string;
  projects?: Project[];
}

export const CreateTaskDialog = ({
  workspaceId,
  projectId,
  projects = [],
}: CreateTaskDialogProps) => {
  const [open, setOpen] = useState(false);

  const user = useAuthStore((state) => state.user);

  const [selectedProjectId, setSelectedProjectId] = useState(projectId ?? "");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<TaskStatus>("TODO");

  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

  const [assignedTo, setAssignedTo] = useState("");

  const [dueDate, setDueDate] = useState("");

  const queryClient = useQueryClient();

  const createTask = useCreateProjectTask();

  const activeProjectId = projectId ?? selectedProjectId;

  const { data: projectMembersData, isLoading: isProjectMembersLoading } =
    useProjectMembers(workspaceId, activeProjectId);

  const projectMembers = projectMembersData?.data ?? [];

  const isWorkspaceMode = !projectId;

  const currentProjectMember =
    user && activeProjectId
      ? projectMembers.find((member) => member.userId._id === user._id)
      : undefined;

  const projectRole: ProjectRole | undefined = currentProjectMember?.role;

  const canCreateTask =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.TASK_CREATE);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setPriority("MEDIUM");
    setAssignedTo("");
    setDueDate("");

    if (isWorkspaceMode) {
      setSelectedProjectId("");
    }

    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !activeProjectId || !canCreateTask) {
      return;
    }

    createTask.mutate(
      {
        workspaceId,
        projectId: activeProjectId,
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          assignedTo: assignedTo || null,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: taskKeys.projectList(workspaceId, activeProjectId),
          });

          queryClient.invalidateQueries({
            queryKey: taskKeys.workspaceList(workspaceId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, activeProjectId),
          });

          resetForm();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            disabled={
              !!activeProjectId && !isProjectMembersLoading && !canCreateTask
            }
          >
            + New Task
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>

          <DialogDescription>
            {isWorkspaceMode
              ? "Create a new task for your workspace."
              : "Create a new task for this project."}
          </DialogDescription>
        </DialogHeader>

        {!canCreateTask && activeProjectId && !isProjectMembersLoading ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium">
              You cannot create tasks in this project.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              You don't have permission to create tasks in the selected project.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Project */}
            {isWorkspaceMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>

                <Select
                  value={selectedProjectId}
                  onValueChange={(value: string | null) => {
                    if (value !== null) {
                      setSelectedProjectId(value);

                      setAssignedTo("");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project">
                      {(value: string | null) => {
                        if (!value) {
                          return "Select a project";
                        }

                        const selectedProject = projects.find(
                          (project) => project._id === value,
                        );

                        return selectedProject?.name ?? "Select a project";
                      }}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {projects.length === 0 ? (
                      <SelectItem value="no-projects" disabled>
                        No projects available
                      </SelectItem>
                    ) : (
                      projects.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          {project.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Task title</label>

              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Design dashboard"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>

              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the task..."
                rows={4}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>

              <Select
                value={status}
                onValueChange={(value: string | null) => {
                  if (value !== null) {
                    setStatus(value as TaskStatus);
                  }
                }}
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
                  if (value !== null) {
                    setPriority(value as TaskPriority);
                  }
                }}
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
                  if (value !== null) {
                    setAssignedTo(value);
                  }
                }}
                disabled={!activeProjectId || isProjectMembersLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !activeProjectId
                        ? "Select a project first"
                        : isProjectMembersLoading
                          ? "Loading members..."
                          : "Select an assignee"
                    }
                  >
                    {(value: string | null) => {
                      if (!value) {
                        return "Select an assignee";
                      }

                      const selectedMember = projectMembers.find(
                        (member) => member.userId._id === value,
                      );

                      return (
                        selectedMember?.userId.name ?? "Select an assignee"
                      );
                    }}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {projectMembers.length === 0 ? (
                    <SelectItem value="no-members" disabled>
                      No project members available
                    </SelectItem>
                  ) : (
                    projectMembers.map((member) => (
                      <SelectItem
                        key={member.userId._id}
                        value={member.userId._id}
                      >
                        {member.userId.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {assignedTo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto px-0 text-xs text-muted-foreground"
                  onClick={() => setAssignedTo("")}
                >
                  Clear assignee
                </Button>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Due date</label>

              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  !title.trim() ||
                  !activeProjectId ||
                  !canCreateTask ||
                  createTask.isPending
                }
              >
                {createTask.isPending ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
