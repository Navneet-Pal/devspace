"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CalendarDays, GripVertical, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import type { Task } from "@/services/task/types";

interface TaskCardProps {
  task: Task;
  showProject?: boolean;
  projectName?: string;
  onClick?: (task: Task) => void;
  disabled?: boolean;
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

export const TaskCard = ({
  task,
  showProject = false,
  projectName,
  onClick,
  disabled = false,
}: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "relative z-50" : undefined}
    >
      <Card
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={() => onClick?.(task)}
        onKeyDown={(event) => {
          if (!onClick) {
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick(task);
          }
        }}
        className={[
          "group border-border/70 bg-card",
          "transition-all duration-150",
          onClick
            ? "cursor-pointer hover:-translate-y-0.5 hover:border-border hover:bg-accent/40"
            : "",
          isDragging ? "shadow-xl opacity-50" : "shadow-sm hover:shadow-md",
        ].join(" ")}
      >
        <CardContent className="space-y-3 p-4">
          {/* Top row */}
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            {!disabled && (
              <button
                type="button"
                aria-label="Drag task"
                {...attributes}
                {...listeners}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="mt-0.5 shrink-0 cursor-grab rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground active:cursor-grabbing group-hover:opacity-100"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            )}

            {/* Title */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h4 className="line-clamp-2 text-sm font-medium leading-5">
                  {task.title}
                </h4>

                <Badge
                  variant={priorityVariant[task.priority]}
                  className="shrink-0 text-[11px]"
                >
                  {priorityLabel[task.priority]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
              {task.description}
            </p>
          )}

          {/* Project */}
          {showProject && (
            <Badge
              variant="outline"
              className="max-w-full truncate text-[11px] font-normal"
            >
              {projectName ?? "Unknown project"}
            </Badge>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {/* Assignee */}
            <div className="flex min-w-0 items-center gap-1.5">
              <User className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">
                {task.assignedTo ? task.assignedTo.name : "Unassigned"}
              </span>
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />

                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
