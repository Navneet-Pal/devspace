"use client";

import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { useAuthStore } from "@/store/auth";

import { useProjectMembers } from "@/hooks/projectMember/useProjectMember";
import { useProjectTasks } from "@/hooks/task/useTask";

import type { ProjectRole } from "@/services/projectMember/types";

import type { TaskPriority, TaskStatus } from "@/services/task/types";

import {
  hasProjectPermission,
  PROJECT_PERMISSION,
} from "@/utils/projectPermission";

import { CreateTaskDialog } from "./CreateTaskDialog";
import { TaskBoard } from "./TaskBoard";
import { TaskFilters } from "./TaskFilters";

interface ProjectTaskSectionProps {
  workspaceId: string;
  projectId: string;
}

export const ProjectTaskSection = ({
  workspaceId,
  projectId,
}: ProjectTaskSectionProps) => {
  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL");

  const [priority, setPriority] = useState<TaskPriority | "ALL">("ALL");

  const user = useAuthStore((state) => state.user);

  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useProjectTasks(workspaceId, projectId);

  const {
    data: projectMembersData,
    isLoading: isProjectMembersLoading,
    isError: isProjectMembersError,
  } = useProjectMembers(workspaceId, projectId);

  const tasks = tasksData?.data ?? [];

  const projectMembers = projectMembersData?.data ?? [];

  const currentProjectMember = user
    ? projectMembers.find((member) => member.userId._id === user._id)
    : undefined;

  const projectRole: ProjectRole | undefined = currentProjectMember?.role;

  const canDrag =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.TASK_UPDATE);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = status === "ALL" || task.status === status;

      const matchesPriority = priority === "ALL" || task.priority === priority;

      return matchesStatus && matchesPriority;
    });
  }, [tasks, status, priority]);

  if (isTasksLoading || isProjectMembersLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </CardContent>
      </Card>
    );
  }

  if (isTasksError || isProjectMembersError) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-destructive">Failed to load tasks.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold">Tasks</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage tasks for this project.
          </p>
        </div>

        <CreateTaskDialog workspaceId={workspaceId} projectId={projectId} />
      </div>

      <TaskFilters
        status={status}
        priority={priority}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
      />

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[250px] items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium">No tasks found</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a task or adjust your filters.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <TaskBoard
          tasks={filteredTasks}
          workspaceId={workspaceId}
          projectId={projectId}
          canDrag={canDrag}
        />
      )}
    </div>
  );
};
