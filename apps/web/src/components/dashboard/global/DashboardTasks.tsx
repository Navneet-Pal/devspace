"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DashboardTask } from "@/services/dashboard/types";

interface DashboardTasksProps {
  tasks: DashboardTask[];
  onTaskClick: (task: DashboardTask) => void;
}

const priorityLabel = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
} as const;

export const DashboardTasks = ({ tasks, onTaskClick }: DashboardTasksProps) => {
  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>

        <p className="text-sm text-muted-foreground">
          Tasks currently assigned to you.
        </p>
      </CardHeader>

      <CardContent>
        {tasks.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground/60" />

            <p className="mt-3 text-sm font-medium">No open tasks</p>

            <p className="mt-1 text-xs text-muted-foreground">
              You're all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <button
                key={task._id}
                type="button"
                onClick={() => onTaskClick(task)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border p-3 text-left transition-colors hover:bg-accent/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{task.title}</p>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {task.projectName}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      {task.status.replaceAll("_", " ")}
                    </Badge>

                    <Badge
                      variant={
                        task.priority === "HIGH" || task.priority === "URGENT"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {priorityLabel[
                        task.priority as keyof typeof priorityLabel
                      ] ?? task.priority}
                    </Badge>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
