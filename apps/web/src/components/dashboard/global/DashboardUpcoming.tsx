"use client";

import { ArrowRight, CalendarDays } from "lucide-react";

import { format, isToday, isTomorrow } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DashboardTask } from "@/services/dashboard/types";

interface DashboardUpcomingProps {
  tasks: DashboardTask[];
  onTaskClick: (task: DashboardTask) => void;
}

const formatDueDate = (date: string) => {
  const value = new Date(date);

  if (isToday(value)) {
    return "Today";
  }

  if (isTomorrow(value)) {
    return "Tomorrow";
  }

  return format(value, "dd MMM yyyy");
};

export const DashboardUpcoming = ({
  tasks,
  onTaskClick,
}: DashboardUpcomingProps) => {
  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader>
        <CardTitle>Upcoming</CardTitle>

        <p className="text-sm text-muted-foreground">
          Your next upcoming due tasks.
        </p>
      </CardHeader>

      <CardContent>
        {tasks.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              No upcoming deadlines.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <button
                key={task._id}
                type="button"
                onClick={() => onTaskClick(task)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-md bg-muted p-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{task.title}</p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {task.projectName}
                    </p>

                    {task.dueDate && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDueDate(task.dueDate)}
                      </p>
                    )}
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
