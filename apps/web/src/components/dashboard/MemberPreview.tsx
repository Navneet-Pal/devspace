"use client";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/SectionCard";

import { MemberItem } from "./MemberItem";
import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";
import { useRouter } from "next/navigation";

interface MembersPreviewProps {
  workspaceId: string;
}

export const MembersPreview = ({ workspaceId }: MembersPreviewProps) => {
  const { data, isLoading, isError } = useWorkspaceMembers(workspaceId);
  const router = useRouter();
  const members = data?.data ?? [];

  return (
    <SectionCard
      title="Members"
      description="People in your workspace."
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/workspaces/${workspaceId}/members`)
          }
        >
          View All
        </Button>
      }
    >
      <div className="space-y-2">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading members...</p>
        )}

        {isError && (
          <p className="text-sm text-destructive">Failed to load members.</p>
        )}

        {!isLoading && !isError && members.length === 0 && (
          <p className="text-sm text-muted-foreground">No members found.</p>
        )}

        {!isLoading &&
          !isError &&
          members
            .slice(0, 3)
            .map((member) => (
              <MemberItem
                key={member._id}
                name={member.userId.name}
                email={member.userId.email}
              />
            ))}
      </div>
    </SectionCard>
  );
};
