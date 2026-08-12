"use client";

import { MembersPreview } from "@/components/dashboard/MemberPreview";
import { MetricsSection } from "@/components/dashboard/MetricsSection";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PendingInvitations } from "@/components/dashboard/PendingInvitation";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { useWorkspace } from "@/hooks/workspace/useWorkspace";

interface WorkspaceDashboardProps{
    workspaceId : string;
}

export const WorkspaceDashboard = ({workspaceId}: WorkspaceDashboardProps) => {

    const { data, isLoading, isError} = useWorkspace(workspaceId);

    if(isLoading){
        return <div>Loading workspace....</div>
    }

    if(isError || !data?.data){
        return <div>Unable to load workspace</div>
    }

    const workspace = data.data;

  return (
    <div className="space-y-8">
      <PageHeader
        title={workspace.name}
        description={workspace.description || "Overview of your workspace"}
      />

      <MetricsSection />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentActivity />
        <RecentProjects />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <MembersPreview workspaceId={workspaceId} />
        <PendingInvitations workspaceId={workspaceId} />
      </div>

      <QuickActions />
    </div>
  );
};