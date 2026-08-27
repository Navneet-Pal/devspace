import { WorkspaceDashboard } from "@/components/dashboard/WorkspaceDashboard";

interface WorkspacePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspacePage({
  params,
}: WorkspacePageProps) {
  const { workspaceId } = await params;

  return <WorkspaceDashboard workspaceId={workspaceId} />;
} 