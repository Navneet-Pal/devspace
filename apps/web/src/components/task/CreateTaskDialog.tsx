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

import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";
import { useCreateProjectTask } from "@/hooks/task/useTask";

import { taskKeys } from "@/services/task/keys";
import { activityKeys } from "@/services/activity/keys";

import type { TaskPriority, TaskStatus } from "@/services/task/types";

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

  const { data: workspaceMembersData, isLoading: isWorkspaceMembersLoading } =
    useWorkspaceMembers(workspaceId);

  const workspaceMembers = workspaceMembersData?.data ?? [];

  const currentWorkspaceMember = user
    ? workspaceMembers.find((member) => member.userId._id === user._id)
    : undefined;

  /*
   * Task creation is an OWNER / ADMIN action.
   *
   * OWNER -> allowed
   * ADMIN -> allowed
   * MEMBER -> not allowed
   */
  const canCreateTask =
    currentWorkspaceMember?.role === "OWNER" ||
    currentWorkspaceMember?.role === "ADMIN";

  const isWorkspaceMode = !projectId;

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

  /*
   * Members must not see the New Task button
   * or have access to the dialog at all.
   */
  if (!canCreateTask) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>+ New Task</Button>} />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>

          <DialogDescription>
            {isWorkspaceMode
              ? "Create a new task for your workspace."
              : "Create a new task for this project."}
          </DialogDescription>
        </DialogHeader>

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
              disabled={!activeProjectId || isWorkspaceMembersLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !activeProjectId
                      ? "Select a project first"
                      : isWorkspaceMembersLoading
                        ? "Loading members..."
                        : "Select an assignee"
                  }
                >
                  {(value: string | null) => {
                    if (!value) {
                      return "Select an assignee";
                    }

                    const selectedMember = workspaceMembers.find(
                      (member) => member.userId._id === value,
                    );

                    return selectedMember?.userId.name ?? "Select an assignee";
                  }}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {workspaceMembers.length === 0 ? (
                  <SelectItem value="no-members" disabled>
                    No workspace members available
                  </SelectItem>
                ) : (
                  workspaceMembers.map((member) => (
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
      </DialogContent>
    </Dialog>
  );
};
