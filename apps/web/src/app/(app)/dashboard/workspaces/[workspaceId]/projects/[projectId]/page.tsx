"use client";

import { use } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useProject } from "@/hooks/project/useProject";

import { ProjectMembers } from "@/components/projectMember/ProjectMembers";
import { AddProjectMemberDialog } from "@/components/projectMember/AddProjectMemberDialog";

interface ProjectPageProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { workspaceId, projectId } = use(params);

  const { data } = useProject(workspaceId, projectId);

  const project = data?.data;

  if (!project) {
    return null;
  }

  return (
    <>
      {/* Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is the overview of your project. Tasks, documentation, files
              and collaboration features will appear here as the project grows.
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

      {/* Project Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Project Members</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                People working on this project.
              </p>
            </div>

            <AddProjectMemberDialog
              workspaceId={workspaceId}
              projectId={projectId}
            />
          </div>
        </CardHeader>

        <CardContent>
          <ProjectMembers workspaceId={workspaceId} projectId={projectId} />
        </CardContent>
      </Card>
    </>
  );
}
