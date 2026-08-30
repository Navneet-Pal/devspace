"use client";
import { SearchBar } from "@/components/common/SearchBar";

import { WorkspaceCard } from "./WorkspaceCard";
import { CreateWorkspaceDialog } from "./create-workspace/CreateWorkspaceDialog";
import { useMyWorkspaces } from "@/hooks/workspace/useWorkspace";
  
export const WorkspaceList = () => {
  const { data: response, isLoading, isError, refetch } = useMyWorkspaces();

  const workspaces = response?.data ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>

          <p className="text-muted-foreground">
            Select a workspace to continue.
          </p>
        </div>

        <CreateWorkspaceDialog />
      </div>

      {/* Search */}
      <SearchBar />

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Failed to load workspaces.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && workspaces.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
          <h3 className="font-medium">No workspaces yet</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first workspace to get started.
          </p>
        </div>
      )}

      {/* Workspace Grid */}
      {!isLoading && !isError && workspaces.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace._id}
              id={workspace._id}
              name={workspace.name}
              description={workspace.description}
            />
          ))}
        </div>
      )}


    </div>
  );
};
