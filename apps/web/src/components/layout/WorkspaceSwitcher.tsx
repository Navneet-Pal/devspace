"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useWorkspaceStore } from "@/store/workspace";
import { useMyWorkspaces } from "@/hooks/workspace/useWorkspace";

export const WorkspaceSwitcher = () => {
  const router = useRouter();

  const { data, isLoading } = useMyWorkspaces();

  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId,
  );

  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace,
  );

  const workspaces = data?.data ?? [];

  const currentWorkspace =
    workspaces.find((workspace) => workspace._id === currentWorkspaceId) ??
    workspaces[0];

  if (isLoading) {
    return <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />;
  }

  if (!currentWorkspace) {
    return null;
  }

  const handleWorkspaceChange = (workspaceId: string) => {
    setCurrentWorkspace(workspaceId);

    router.push(`/dashboard/workspaces/${workspaceId}`);
  };

  const handleManageWorkspaces = () => {
    router.push("/dashboard/workspaces");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-auto w-full items-center justify-between rounded-xl border bg-card px-4 py-3 text-left outline-none transition-colors hover:bg-accent">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {currentWorkspace.name}
          </p>

          <p className="text-xs text-muted-foreground">Workspace</p>
        </div>

        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[240px]">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Switch workspace
        </div>

        <DropdownMenuSeparator />

        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            onClick={() => handleWorkspaceChange(workspace._id)}
            className="flex items-center justify-between"
          >
            <span className="truncate">{workspace.name}</span>

            {workspace._id === currentWorkspaceId && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleManageWorkspaces}>
          Manage workspaces
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
