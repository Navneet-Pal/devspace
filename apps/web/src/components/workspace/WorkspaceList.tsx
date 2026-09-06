"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { WorkspaceCard } from "./WorkspaceCard";
import { CreateWorkspaceDialog } from "./create-workspace/CreateWorkspaceDialog";
import { useMyWorkspaces } from "@/hooks/workspace/useWorkspace";

type SortOption = "UPDATED_DESC" | "CREATED_DESC" | "NAME_ASC" | "NAME_DESC";

export const WorkspaceList = () => {
  const { data: response, isLoading, isError, refetch } = useMyWorkspaces();

  const workspaces = response?.data ?? [];

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("UPDATED_DESC");

  const [showFilters, setShowFilters] = useState(false);

  const filteredWorkspaces = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = workspaces.filter((workspace) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        workspace.name.toLowerCase().includes(normalizedSearch) ||
        workspace.slug.toLowerCase().includes(normalizedSearch) ||
        workspace.description?.toLowerCase().includes(normalizedSearch)
      );
    });

    return [...result].sort((a, b) => {
      switch (sortOption) {
        case "NAME_ASC":
          return a.name.localeCompare(b.name);

        case "NAME_DESC":
          return b.name.localeCompare(a.name);

        case "CREATED_DESC":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        case "UPDATED_DESC":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });
  }, [workspaces, search, sortOption]);

  const hasActiveFilters =
    search.trim().length > 0 || sortOption !== "UPDATED_DESC";

  const clearFilters = () => {
    setSearch("");
    setSortOption("UPDATED_DESC");
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case "CREATED_DESC":
        return "Recently Created";

      case "NAME_ASC":
        return "Name A → Z";

      case "NAME_DESC":
        return "Name Z → A";

      case "UPDATED_DESC":
      default:
        return "Recently Updated";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />

            <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          </div>

          <p className="text-muted-foreground">
            Select a workspace to continue.
          </p>
        </div>

        <CreateWorkspaceDialog />
      </div>

      {/* Loading */}
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

      {/* Error */}
      {isError && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
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

      {!isLoading && !isError && (
        <>
          {/* No workspaces */}
          {workspaces.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
              <div className="rounded-full bg-muted p-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-medium">No workspaces yet</h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Create your first workspace to get started.
              </p>

              <div className="mt-4">
                <CreateWorkspaceDialog />
              </div>
            </div>
          )}

          {/* Search + Filters */}
          {workspaces.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative w-full lg:max-w-xl">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search workspaces..."
                    className="pl-9"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters((current) => !current)}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>

              {showFilters && (
                <Card className="border-border/60 shadow-none">
                  <CardContent className="p-4">
                    <div className="max-w-sm space-y-2">
                      <p className="text-sm font-medium">Sort by</p>

                      <div className="relative">
                        <select
                          value={sortOption}
                          onChange={(event) =>
                            setSortOption(event.target.value as SortOption)
                          }
                          className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
                        >
                          <option value="UPDATED_DESC">Recently Updated</option>

                          <option value="CREATED_DESC">Recently Created</option>

                          <option value="NAME_ASC">Name A → Z</option>

                          <option value="NAME_DESC">Name Z → A</option>
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {hasActiveFilters && (
                <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {filteredWorkspaces.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {workspaces.length}
                    </span>{" "}
                    workspaces
                  </p>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* No search results */}
          {workspaces.length > 0 && filteredWorkspaces.length === 0 && (
            <Card>
              <CardContent className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>

                <h2 className="mt-4 text-lg font-semibold">
                  No workspaces found
                </h2>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  No workspace matches your current search or filters.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Workspace Grid */}
          {filteredWorkspaces.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredWorkspaces.length}{" "}
                  {filteredWorkspaces.length === 1 ? "workspace" : "workspaces"}
                </p>

                <p className="text-xs text-muted-foreground">
                  {getSortLabel()}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredWorkspaces.map((workspace) => (
                  <WorkspaceCard
                    key={workspace._id}
                    id={workspace._id}
                    name={workspace.name}
                    description={workspace.description ?? undefined}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
