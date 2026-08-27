"use client";

import { CalendarDays, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Task } from "@/services/task/types";

interface TaskDetailsProps {
  task: Task;
}

const priorityVariant = {
  LOW: "secondary",
  MEDIUM: "outline",
  HIGH: "destructive",
  URGENT: "destructive",
} as const;

const statusLabel = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
} as const;

export const TaskDetails = ({ task }: TaskDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{task.title}</CardTitle>

            {task.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>

          <Badge variant={priorityVariant[task.priority]}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{statusLabel[task.status]}</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Assignee</p>

            <div className="mt-1 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />

              <p className="text-sm">
                {task.assignedTo ? task.assignedTo.name : "Unassigned"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Due date</p>

            <div className="mt-1 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />

              <p className="text-sm">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Created</p>

            <p className="mt-1 text-sm">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Last updated</p>

            <p className="mt-1 text-sm">
              {new Date(task.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
