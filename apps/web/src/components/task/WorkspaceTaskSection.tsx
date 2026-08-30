"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";

import { useAuthStore } from "@/store/auth";

import { useProjects } from "@/hooks/project/useProject";
import { useWorkspaceTasks } from "@/hooks/task/useTask";

import { projectMemberService } from "@/services/projectMember/service";

import type { TaskPriority, TaskStatus } from "@/services/task/types";

import {
  hasProjectPermission,
  PROJECT_PERMISSION,
} from "@/utils/projectPermission";

import { CreateTaskDialog } from "./CreateTaskDialog";
import { TaskBoard } from "./TaskBoard";
import { TaskFilters } from "./TaskFilters";

interface WorkspaceTaskSectionProps {
  workspaceId: string;
}

export const WorkspaceTaskSection = ({
  workspaceId,
}: WorkspaceTaskSectionProps) => {
  const [projectId, setProjectId] = useState("");

  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL");

  const [priority, setPriority] = useState<TaskPriority | "ALL">("ALL");

  const [search, setSearch] = useState("");

  const user = useAuthStore((state) => state.user);

  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useWorkspaceTasks(workspaceId);

  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useProjects(workspaceId);

  const tasks = tasksData?.data ?? [];
  const projects = projectsData?.data ?? [];

  /*
   * Fetch members for every project in the workspace.
   * We need this because each project can have a
   * different role for the current user.
   */
  const projectMemberQueries = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["workspace-project-members", workspaceId, project._id],

      queryFn: () =>
        projectMemberService.getProjectMembers(workspaceId, project._id),

      enabled: !!user && !!project._id,
    })),
  });

  /*
   * taskId -> whether current user can update
   * that task's project.
   */
  const draggableTaskIds = useMemo(() => {
    const allowedTaskIds = new Set<string>();

    if (!user) {
      return allowedTaskIds;
    }

    projects.forEach((project, index) => {
      const projectMembers = projectMemberQueries[index]?.data?.data ?? [];

      const currentMember = projectMembers.find(
        (member) => member.userId._id === user._id,
      );

      const role = currentMember?.role;

      const canUpdate =
        !!role && hasProjectPermission(role, PROJECT_PERMISSION.TASK_UPDATE);

      if (!canUpdate) {
        return;
      }

      tasks
        .filter((task) => task.projectId === project._id)
        .forEach((task) => {
          allowedTaskIds.add(task._id);
        });
    });

    return allowedTaskIds;
  }, [user, projects, tasks, projectMemberQueries]);

  const projectNames = useMemo(() => {
    return Object.fromEntries(
      projects.map((project) => [project._id, project.name]),
    );
  }, [projects]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesProject = !projectId || task.projectId === projectId;

      const matchesStatus = status === "ALL" || task.status === status;

      const matchesPriority = priority === "ALL" || task.priority === priority;

      const matchesSearch =
        !normalizedSearch ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description?.toLowerCase().includes(normalizedSearch);

      return (
        matchesProject && matchesStatus && matchesPriority && matchesSearch
      );
    });
  }, [tasks, projectId, status, priority, search]);

  const clearFilters = () => {
    setProjectId("");
    setStatus("ALL");
    setPriority("ALL");
    setSearch("");
  };

  const hasFilters =
    !!search.trim() ||
    projectId !== "" ||
    status !== "ALL" ||
    priority !== "ALL";

  if (isTasksLoading || isProjectsLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </CardContent>
      </Card>
    );
  }

  if (isTasksError || isProjectsError) {
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
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold">Tasks</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage tasks across this workspace.
          </p>
        </div>

        <CreateTaskDialog workspaceId={workspaceId} projects={projects} />
      </div>

      {/* Filters + Search */}
      <TaskFilters
        search={search}
        projectId={projectId}
        projects={projects}
        status={status}
        priority={priority}
        onSearchChange={setSearch}
        onProjectChange={setProjectId}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
      />

      {/* Result summary */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredTasks.length}
          </span>{" "}
          of <span className="font-medium text-foreground">{tasks.length}</span>{" "}
          tasks
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Empty / Filtered State */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[250px] items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium">
                {tasks.length === 0 ? "No tasks yet" : "No tasks found"}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {tasks.length === 0
                  ? "Create a task to start organizing work."
                  : "Try changing your search or filters."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <TaskBoard
          tasks={filteredTasks}
          workspaceId={workspaceId}
          showProject
          projectNames={projectNames}
          canDrag={draggableTaskIds.size > 0}
          draggableTaskIds={draggableTaskIds}
        />
      )}
    </div>
  );
};
