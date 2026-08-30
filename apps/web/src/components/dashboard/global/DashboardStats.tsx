"use client";

import { FolderKanban, ListTodo, Mail, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  stats: {
    workspaces: number;
    projects: number;
    myOpenTasks: number;
    pendingInvitations: number;
  };
}

const metrics = [
  {
    key: "workspaces" as const,
    title: "Workspaces",
    icon: Users,
  },
  {
    key: "projects" as const,
    title: "Projects",
    icon: FolderKanban,
  },
  {
    key: "myOpenTasks" as const,
    title: "My Open Tasks",
    icon: ListTodo,
  },
  {
    key: "pendingInvitations" as const,
    title: "Pending Invitations",
    icon: Mail,
  },
];

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card key={metric.key} className="border-border/60 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {metric.title}
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-tight">
                    {stats[metric.key]}
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-2.5">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
};
