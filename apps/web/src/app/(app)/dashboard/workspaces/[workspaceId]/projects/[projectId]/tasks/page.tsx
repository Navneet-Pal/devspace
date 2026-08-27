"use client";

import { use } from "react";

import { ProjectTaskSection } from "@/components/task/ProjectTaskSection";

interface ProjectTasksPageProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function ProjectTasksPage({ params }: ProjectTasksPageProps) {
  const { workspaceId, projectId } = use(params);

  return <ProjectTaskSection workspaceId={workspaceId} projectId={projectId} />;
}
