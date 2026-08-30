"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  ListTodo,
  Search,
} from "lucide-react";
import { isToday, isBefore, startOfDay } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { TaskDetailsDialog } from "@/components/task/TaskDetailsDialog";

import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { useTask } from "@/hooks/task/useTask";

import type { DashboardTask } from "@/services/dashboard/types";

type StatusFilter = "ALL" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

type PriorityFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH" | "URGENT";

const priorityLabel = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
} as const;

const formatStatus = (status: string) => {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getPriorityVariant = (
  priority: string,
): "secondary" | "outline" | "destructive" => {
  if (priority === "HIGH" || priority === "URGENT") {
    return "destructive";
  }

  if (priority === "MEDIUM") {
    return "outline";
  }

  return "secondary";
};

const getDueDateLabel = (dueDate: string | null) => {
  if (!dueDate) {
    return "No due date";
  }

  const date = new Date(dueDate);

  if (isToday(date)) {
    return "Today";
  }

  return date.toLocaleDateString();
};

const getDueDateClass = (dueDate: string | null) => {
  if (!dueDate) {
    return "text-muted-foreground";
  }

  const date = new Date(dueDate);

  if (isToday(date)) {
    return "text-amber-500";
  }

  if (isBefore(startOfDay(date), startOfDay(new Date()))) {
    return "text-destructive";
  }

  return "text-muted-foreground";
};

export default function MyTasksPage() {
  const { data, isLoading, isError } = useDashboard();

  const [search, setSearch] = useState("");
  const [workspaceFilter, setWorkspaceFilter] = useState("ALL");
  const [projectFilter, setProjectFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");

  const [selectedTask, setSelectedTask] = useState<DashboardTask | null>(null);

  const { data: taskData, isLoading: isTaskLoading } = useTask(
    selectedTask?.workspaceId ?? "",
    selectedTask?.projectId ?? "",
    selectedTask?._id ?? "",
  );

  const dashboard = data?.data;

  const tasks = dashboard?.myTasks ?? [];

  const workspaces = dashboard?.workspaces ?? [];

  const projectOptions = useMemo(() => {
    const projects = new Map<string, string>();

    tasks.forEach((task) => {
      projects.set(task.projectId, task.projectName);
    });

    return Array.from(projects.entries()).sort(([, first], [, second]) =>
      first.localeCompare(second),
    );
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !normalizedSearch ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.projectName.toLowerCase().includes(normalizedSearch);

      const matchesWorkspace =
        workspaceFilter === "ALL" || task.workspaceId === workspaceFilter;

      const matchesProject =
        projectFilter === "ALL" || task.projectId === projectFilter;

      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesWorkspace &&
        matchesProject &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tasks,
    search,
    workspaceFilter,
    projectFilter,
    statusFilter,
    priorityFilter,
  ]);

  const totalTasks = tasks.length;

  const openTasks = tasks.filter((task) => task.status !== "DONE").length;

  const dueToday = tasks.filter(
    (task) => !!task.dueDate && isToday(new Date(task.dueDate)),
  ).length;

  const overdue = tasks.filter((task) => {
    if (!task.dueDate || task.status === "DONE") {
      return false;
    }

    return isBefore(startOfDay(new Date(task.dueDate)), startOfDay(new Date()));
  }).length;

  const hasFilters =
    search.trim().length > 0 ||
    workspaceFilter !== "ALL" ||
    projectFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setWorkspaceFilter("ALL");
    setProjectFilter("ALL");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
  };

  const handleTaskClick = (task: DashboardTask) => {
    setSelectedTask(task);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedTask(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border-b pb-6">
          <div className="h-9 w-40 animate-pulse rounded bg-muted" />

          <div className="mt-2 h-5 w-80 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>

        <div className="h-16 animate-pulse rounded-xl border bg-muted/40" />

        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />

          <h1 className="mt-3 text-lg font-semibold">
            Unable to load your tasks
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while loading your tasks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2">
              <ListTodo className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>

              <p className="mt-1 text-muted-foreground">
                Tasks assigned to you across your workspaces.
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Total tasks</p>

                <p className="mt-1 text-2xl font-semibold">{totalTasks}</p>
              </div>

              <div className="rounded-lg bg-muted p-2">
                <ListTodo className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Open tasks</p>

                <p className="mt-1 text-2xl font-semibold">{openTasks}</p>
              </div>

              <div className="rounded-lg bg-muted p-2">
                <CircleDot className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Due today</p>

                <p className="mt-1 text-2xl font-semibold">{dueToday}</p>
              </div>

              <div className="rounded-lg bg-muted p-2">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>

                <p className="mt-1 text-2xl font-semibold">{overdue}</p>
              </div>

              <div className="rounded-lg bg-muted p-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.5fr)_repeat(4,minmax(140px,1fr))_auto]">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks..."
                  className="pl-9"
                />
              </div>

              {/* Workspace */}
              <select
                value={workspaceFilter}
                onChange={(event) => setWorkspaceFilter(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring"
              >
                <option value="ALL">All workspaces</option>

                {workspaces.map((workspace) => (
                  <option key={workspace._id} value={workspace._id}>
                    {workspace.name}
                  </option>
                ))}
              </select>

              {/* Project */}
              <select
                value={projectFilter}
                onChange={(event) => setProjectFilter(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring"
              >
                <option value="ALL">All projects</option>

                {projectOptions.map(([projectId, projectName]) => (
                  <option key={projectId} value={projectId}>
                    {projectName}
                  </option>
                ))}
              </select>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring"
              >
                <option value="ALL">All statuses</option>

                <option value="TODO">Todo</option>

                <option value="IN_PROGRESS">In Progress</option>

                <option value="IN_REVIEW">In Review</option>

                <option value="DONE">Done</option>
              </select>

              {/* Priority */}
              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value as PriorityFilter)
                }
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring"
              >
                <option value="ALL">All priorities</option>

                <option value="LOW">Low</option>

                <option value="MEDIUM">Medium</option>

                <option value="HIGH">High</option>

                <option value="URGENT">Urgent</option>
              </select>

              {/* Clear */}
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                disabled={!hasFilters}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {hasFilters ? "Filtered Tasks" : "Assigned Tasks"}
            </h2>

            <p className="text-sm text-muted-foreground">
              Showing {filteredTasks.length} of {tasks.length}{" "}
              {tasks.length === 1 ? "task" : "tasks"}
            </p>
          </div>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>

        {/* Tasks */}
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-[280px] flex-col items-center justify-center text-center">
              {tasks.length === 0 ? (
                <>
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground/60" />

                  <h2 className="mt-4 font-semibold">
                    No tasks assigned to you
                  </h2>

                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Tasks assigned to you will appear here.
                  </p>
                </>
              ) : (
                <>
                  <Search className="h-10 w-10 text-muted-foreground/60" />

                  <h2 className="mt-4 font-semibold">No matching tasks</h2>

                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Try changing your search or filters.
                  </p>

                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <button
                key={task._id}
                type="button"
                onClick={() => handleTaskClick(task)}
                className="group w-full text-left"
              >
                <Card className="transition-colors hover:border-primary/50 hover:bg-accent/20">
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      {/* Main */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-semibold">
                            {task.title}
                          </h3>

                          <Badge variant="outline">
                            {formatStatus(task.status)}
                          </Badge>

                          <Badge variant={getPriorityVariant(task.priority)}>
                            {priorityLabel[
                              task.priority as keyof typeof priorityLabel
                            ] ?? task.priority}
                          </Badge>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>{task.projectName}</span>

                          {task.dueDate && (
                            <span
                              className={`flex items-center gap-1.5 ${getDueDateClass(task.dueDate)}`}
                            >
                              <CalendarDays className="h-3.5 w-3.5" />

                              {getDueDateLabel(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1">
                        →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Task Details */}
      {selectedTask && (
        <TaskDetailsDialog
          task={taskData?.data ?? null}
          open
          onOpenChange={handleDialogChange}
          workspaceId={selectedTask.workspaceId}
          projectId={selectedTask.projectId}
        />
      )}

      {selectedTask && isTaskLoading && (
        <div className="sr-only">Loading task details...</div>
      )}
    </>
  );
}
