"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TaskPriority, TaskStatus } from "@/services/task/types";

interface TaskFiltersProps {
  search?: string;
  projectId?: string;
  projects?: {
    _id: string;
    name: string;
  }[];
  status: TaskStatus | "ALL";
  priority: TaskPriority | "ALL";
  onSearchChange?: (search: string) => void;
  onProjectChange?: (projectId: string) => void;
  onStatusChange: (status: TaskStatus | "ALL") => void;
  onPriorityChange: (priority: TaskPriority | "ALL") => void;
}

export const TaskFilters = ({
  search = "",
  projectId,
  projects = [],
  status,
  priority,
  onSearchChange,
  onProjectChange,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) => {
  const hasProjectFilter = !!onProjectChange && projects.length > 0;

  const hasFilters =
    search.trim() !== "" ||
    status !== "ALL" ||
    priority !== "ALL" ||
    (!!projectId && hasProjectFilter);

  const clearFilters = () => {
    onSearchChange?.("");

    onProjectChange?.("");

    onStatusChange("ALL");

    onPriorityChange("ALL");
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      {onSearchChange && (
        <div className="relative w-full lg:max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks..."
            className="pl-9"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Project */}
        {hasProjectFilter && (
          <Select
            value={projectId || "ALL"}
            onValueChange={(value) => {
              if (value !== null) {
                onProjectChange(value === "ALL" ? "" : value);
              }
            }}
          >
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Project">
                {(value) => {
                  if (!value || value === "ALL") {
                    return "All projects";
                  }

                  const selectedProject = projects.find(
                    (project) => project._id === value,
                  );

                  return selectedProject?.name ?? "All projects";
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All projects</SelectItem>

              {projects.map((project) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Status */}
        <Select
          value={status}
          onValueChange={(value) => {
            if (value !== null) {
              onStatusChange(value as TaskStatus | "ALL");
            }
          }}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>

            <SelectItem value="TODO">Todo</SelectItem>

            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>

            <SelectItem value="IN_REVIEW">In Review</SelectItem>

            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority */}
        <Select
          value={priority}
          onValueChange={(value) => {
            if (value !== null) {
              onPriorityChange(value as TaskPriority | "ALL");
            }
          }}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All priorities</SelectItem>

            <SelectItem value="LOW">Low</SelectItem>

            <SelectItem value="MEDIUM">Medium</SelectItem>

            <SelectItem value="HIGH">High</SelectItem>

            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
