"use client";

import { use } from "react";

import { WorkspaceTaskSection } from "@/components/task/WorkspaceTaskSection";

interface TasksPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default function TasksPage({ params }: TasksPageProps) {
  const { workspaceId } = use(params);

  return <WorkspaceTaskSection workspaceId={workspaceId} />;
}
