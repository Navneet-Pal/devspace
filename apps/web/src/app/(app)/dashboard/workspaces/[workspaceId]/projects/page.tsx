"use client";

import Link from "next/link";
import { use } from "react";
import { FolderKanban } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";

import { useProjects } from "@/hooks/project/useProject";

interface ProjectsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const { workspaceId } = use(params);

  const { data, isLoading, isError } = useProjects(workspaceId);

  const projects = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
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
        <div className="flex min-h-[30vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-destructive">Failed to load projects.</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !isError && projects.length === 0 && (
        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-4">
              <FolderKanban className="h-8 w-8 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">No projects yet</h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Create your first project to start organizing your work.
            </p>

            <CreateProjectDialog workspaceId={workspaceId} />
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {!isLoading && !isError && projects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/dashboard/workspaces/${workspaceId}/projects/${project._id}`}
            >
              <Card className="h-full transition-colors hover:bg-accent/50">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-lg bg-muted p-2">
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
                        project.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {project.status === "ACTIVE" ? "Active" : "Archived"}
                    </Badge>
                  </div>

                  {project.description && (
                    <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
