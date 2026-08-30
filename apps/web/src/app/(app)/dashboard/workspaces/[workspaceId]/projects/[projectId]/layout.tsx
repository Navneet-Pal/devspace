"use client";

import Link from "next/link";
import { use, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useProject } from "@/hooks/project/useProject";
import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";

import { EditProjectDialog } from "@/components/project/EditProjectDialog";
import { ProjectActions } from "@/components/project/ProjectActions";

import { useAuthStore } from "@/store/auth";

interface ProjectLayoutProps {
  children: ReactNode;
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { workspaceId, projectId } = use(params);

  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError } = useProject(workspaceId, projectId);

  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useWorkspaceMembers(workspaceId);

  const project = data?.data;

  const workspaceMembers = membersData?.data ?? [];

  const currentMember = user
    ? workspaceMembers.find((member) => member.userId._id === user._id)
    : undefined;

  const canManageProject =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const projectBasePath = `/dashboard/workspaces/${workspaceId}/projects/${projectId}`;

  const isOverviewActive = pathname === projectBasePath;

  const isTasksActive =
    pathname === `${projectBasePath}/tasks` ||
    pathname.startsWith(`${projectBasePath}/tasks/`);

  const isActivityActive =
    pathname === `${projectBasePath}/activity` ||
    pathname.startsWith(`${projectBasePath}/activity/`);

  const isDocumentationActive =
    pathname === `${projectBasePath}/documentation` ||
    pathname.startsWith(`${projectBasePath}/documentation/`);

  const isFilesActive =
    pathname === `${projectBasePath}/files` ||
    pathname.startsWith(`${projectBasePath}/files/`);

  if (isLoading || isMembersLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (isError || isMembersError || !project) {
    return (
      <div className="space-y-4">
        <Link href={`/dashboard/workspaces/${workspaceId}/projects`}>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>

        <div className="rounded-xl border p-6 text-center">
          <p className="text-sm text-destructive">Failed to load project.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href={`/dashboard/workspaces/${workspaceId}/projects`}>
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Projects
        </Button>
      </Link>

      {/* Project Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">{project.name}</h1>

            <Badge
              variant={project.status === "Active" ? "default" : "secondary"}
            >
              {project.status === "Active" ? "Active" : "Archived"}
            </Badge>
          </div>

          {project.description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>

        {/* Only OWNER / ADMIN can manage the project */}
        {canManageProject && (
          <div className="flex items-center gap-2">
            <EditProjectDialog
              workspaceId={workspaceId}
              projectId={projectId}
              name={project.name}
              description={project.description}
              status={project.status}
            />

            <ProjectActions workspaceId={workspaceId} projectId={projectId} />
          </div>
        )}
      </div>

      {/* Project Navigation */}
      <div className="border-b">
        <nav className="flex gap-6 overflow-x-auto">
          {/* Overview */}
          <Link href={projectBasePath}>
            <Button
              variant="ghost"
              className={`rounded-none ${
                isOverviewActive ? "border-b-2 border-primary" : ""
              }`}
            >
              Overview
            </Button>
          </Link>

          {/* Tasks */}
          <Link href={`${projectBasePath}/tasks`}>
            <Button
              variant="ghost"
              className={`rounded-none ${
                isTasksActive ? "border-b-2 border-primary" : ""
              }`}
            >
              Tasks
            </Button>
          </Link>

          {/* Documentation */}
          <Link href={`${projectBasePath}/documentation`}>
            <Button
              variant="ghost"
              className={`rounded-none ${
                isDocumentationActive ? "border-b-2 border-primary" : ""
              }`}
            >
              Documentation
            </Button>
          </Link>

          {/* Files */}
          <Link href={`${projectBasePath}/files`}>
            <Button
              variant="ghost"
              className={`rounded-none ${
                isFilesActive ? "border-b-2 border-primary" : ""
              }`}
            >
              Files
            </Button>
          </Link>

          {/* Activity */}
          <Link href={`${projectBasePath}/activity`}>
            <Button
              variant="ghost"
              className={`rounded-none ${
                isActivityActive ? "border-b-2 border-primary" : ""
              }`}
            >
              Activity
            </Button>
          </Link>
        </nav>
      </div>

      {/* Current Project Section */}
      {children}
    </div>
  );
}
