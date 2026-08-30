"use client";

import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useWorkspaceStore } from "@/store/workspace";

import type { DashboardWorkspace } from "@/services/dashboard/types";

interface DashboardWorkspacesProps {
  workspaces: DashboardWorkspace[];
}

export const DashboardWorkspaces = ({
  workspaces,
}: DashboardWorkspacesProps) => {
  const router = useRouter();

  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace,
  );

  const handleWorkspaceClick = (workspaceId: string) => {
    setCurrentWorkspace(workspaceId);

    router.push(`/dashboard/workspaces/${workspaceId}`);
  };

  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />

          <CardTitle>My Workspaces</CardTitle>
        </div>

        <p className="text-sm text-muted-foreground">
          Workspaces you currently have access to.
        </p>
      </CardHeader>

      <CardContent>
        {workspaces.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              You don't belong to any workspace yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {workspaces.map((workspace) => (
              <button
                key={workspace._id}
                type="button"
                onClick={() => handleWorkspaceClick(workspace._id)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border p-3 text-left transition-colors hover:bg-accent/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {workspace.name}
                  </p>

                  {workspace.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {workspace.description}
                    </p>
                  )}
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
