"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import {
  ChevronDown,
  FolderKanban,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";

import { useProjects } from "@/hooks/project/useProject";

interface ProjectsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

type StatusFilter = "ALL" | "Active" | "Archived";

type SortOption = "UPDATED_DESC" | "CREATED_DESC" | "NAME_ASC" | "NAME_DESC";

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const { workspaceId } = use(params);

  const { data, isLoading, isError } = useProjects(workspaceId);

  const projects = data?.data ?? [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [sortOption, setSortOption] = useState<SortOption>("UPDATED_DESC");

  const [showFilters, setShowFilters] = useState(false);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = projects.filter((project) => {
      const matchesSearch =
        !normalizedSearch ||
        project.name.toLowerCase().includes(normalizedSearch) ||
        project.description?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
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
  }, [projects, search, statusFilter, sortOption]);

  const activeProjects = projects.filter(
    (project) => project.status === "Active",
  ).length;

  const archivedProjects = projects.length - activeProjects;

  const hasActiveFilters =
    search.trim().length > 0 ||
    statusFilter !== "ALL" ||
    sortOption !== "UPDATED_DESC";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="h-6 w-6" />

            <h1 className="text-2xl font-semibold">Projects</h1>
          </div>

          <p className="mt-1 text-muted-foreground">
            Manage and organize projects in this workspace.
          </p>
        </div>

        <CreateProjectDialog workspaceId={workspaceId} />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted" />

                    <div className="space-y-2">
                      <div className="h-4 w-28 rounded bg-muted" />

                      <div className="h-3 w-16 rounded bg-muted" />
                    </div>
                  </div>

                  <div className="h-6 w-16 rounded-full bg-muted" />
                </div>

                <div className="h-4 w-full rounded bg-muted" />

                <div className="h-4 w-2/3 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <Card>
          <CardContent className="flex min-h-[300px] items-center justify-center p-6 text-center">
            <div>
              <p className="text-sm font-medium">Failed to load projects.</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && (
        <>
          {/* Summary */}
          {projects.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="border-border/60 shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">
                    Total projects
                  </p>

                  <p className="mt-1 text-2xl font-semibold">
                    {projects.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Active</p>

                  <p className="mt-1 text-2xl font-semibold">
                    {activeProjects}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Archived</p>

                  <p className="mt-1 text-2xl font-semibold">
                    {archivedProjects}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search + Filters */}
          {projects.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative w-full lg:max-w-xl">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search projects..."
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
                  <CardContent className="grid gap-4 p-4 md:grid-cols-2">
                    {/* Status */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Status</p>

                      <div className="flex flex-wrap gap-2">
                        {(["ALL", "Active", "Archived"] as const).map(
                          (status) => (
                            <Button
                              key={status}
                              type="button"
                              size="sm"
                              variant={
                                statusFilter === status ? "default" : "outline"
                              }
                              onClick={() => setStatusFilter(status)}
                            >
                              {status === "ALL" ? "All" : status}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Sort */}
                    <div className="space-y-2">
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

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                      {filteredProjects.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {projects.length}
                    </span>{" "}
                    projects
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

          {/* No projects */}
          {projects.length === 0 && (
            <Card>
              <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-4">
                  <FolderKanban className="h-8 w-8 text-muted-foreground" />
                </div>

                <h2 className="mt-4 text-lg font-semibold">No projects yet</h2>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Create your first project to start organizing your work.
                </p>

                <div className="mt-4">
                  <CreateProjectDialog workspaceId={workspaceId} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* No search results */}
          {projects.length > 0 && filteredProjects.length === 0 && (
            <Card>
              <CardContent className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>

                <h2 className="mt-4 text-lg font-semibold">
                  No projects found
                </h2>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  No project matches your current search or filters.
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

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredProjects.length}{" "}
                  {filteredProjects.length === 1 ? "project" : "projects"}
                </p>

                <p className="text-xs text-muted-foreground">
                  {getSortLabel()}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/dashboard/workspaces/${workspaceId}/projects/${project._id}`}
                    className="group"
                  >
                    <Card className="h-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-accent/40 hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="shrink-0 rounded-lg bg-muted p-2">
                              <FolderKanban className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <h2 className="truncate font-semibold">
                                {project.name}
                              </h2>

                              <p className="mt-1 text-xs text-muted-foreground">
                                Project
                              </p>
                            </div>
                          </div>

                          <Badge
                            variant={
                              project.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>

                        {project.description && (
                          <p className="mt-4 line-clamp-3 text-sm leading-5 text-muted-foreground">
                            {project.description}
                          </p>
                        )}

                        <div className="mt-5 flex items-center justify-between border-t pt-4">
                          <span className="text-xs text-muted-foreground">
                            Open project
                          </span>

                          <span className="text-sm font-medium text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground">
                            →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
