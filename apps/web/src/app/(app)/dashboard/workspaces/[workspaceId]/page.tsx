"use client";

import { use, useEffect } from "react";

import { WorkspaceDashboard } from "@/components/dashboard/WorkspaceDashboard";
import { useWorkspaceStore } from "@/store/workspace";

interface WorkspacePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceId } = use(params);

  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace,
  );

  useEffect(() => {
    setCurrentWorkspace(workspaceId);
  }, [workspaceId, setCurrentWorkspace]);

  return <WorkspaceDashboard workspaceId={workspaceId} />;
}
