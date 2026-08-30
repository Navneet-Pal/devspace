"use client";

import { use } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useProject } from "@/hooks/project/useProject";
import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";

interface ProjectPageProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { workspaceId, projectId } = use(params);

  const { data: projectResponse } = useProject(workspaceId, projectId);

  const {
    data: membersResponse,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useWorkspaceMembers(workspaceId);

  const project = projectResponse?.data;
  const workspaceMembers = membersResponse?.data ?? [];

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              This project is part of your workspace. Workspace members
              automatically have access to the projects in this workspace
              according to their workspace permissions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Status</p>

              <p className="mt-1 text-sm font-medium">{project.status}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Created</p>

              <p className="mt-1 text-sm font-medium">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* People with Access */}
      <Card>
        <CardHeader>
          <CardTitle>People with access</CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Workspace members who can access this project.
          </p>
        </CardHeader>

        <CardContent>
          {isMembersLoading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading people with access...
              </p>
            </div>
          ) : isMembersError ? (
            <div className="flex min-h-[180px] items-center justify-center text-center">
              <p className="text-sm text-destructive">
                Failed to load workspace members.
              </p>
            </div>
          ) : workspaceMembers.length === 0 ? (
            <div className="flex min-h-[180px] items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">
                No workspace members found.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {workspaceMembers.slice(0, 5).map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {member.userId.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {member.userId.email}
                    </p>
                  </div>

                  <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                    {member.role}
                  </span>
                </div>
              ))}

              {workspaceMembers.length > 5 && (
                <p className="pt-2 text-center text-xs text-muted-foreground">
                  +{workspaceMembers.length - 5} more workspace members
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
