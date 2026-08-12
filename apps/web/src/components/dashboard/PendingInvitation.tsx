"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/SectionCard";

import { InvitationItem } from "./InvitationItem";
import {
  useCancelInvitation,
  useWorkspaceInvitations,
} from "@/hooks/workspaceInvitation/workspaceInvitation";

interface PendingInvitationsProps {
  workspaceId: string;
}

export const PendingInvitations = ({
  workspaceId,
}: PendingInvitationsProps) => {
  const { data, isLoading, isError } = useWorkspaceInvitations(workspaceId);
  const router = useRouter();
  const cancelInvitation = useCancelInvitation();

  const invitations =
    data?.data?.filter((invitation) => invitation.status === "PENDING") ?? [];

  const handleCancel = (invitationId: string) => {
    cancelInvitation.mutate(invitationId);
  };

  return (
    <SectionCard
      title="Pending Invitations"
      description="People waiting to join your workspace."
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/workspaces/${workspaceId}/invitations`)
          }
        >
          View All
        </Button>
      }
    >
      <div className="space-y-2">
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Loading invitations...
          </p>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Failed to load invitations.
          </p>
        )}

        {!isLoading && !isError && invitations.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No pending invitations.
          </p>
        )}

        {!isLoading &&
          !isError &&
          invitations
            .slice(0, 3)
            .map((invitation) => (
              <InvitationItem
                key={invitation._id}
                name={invitation.userId.name}
                email={invitation.userId.email}
                avatar={invitation.userId.avatar}
                onCancel={() => handleCancel(invitation._id)}
                isCancelling={cancelInvitation.isPending}
              />
            ))}
      </div>
    </SectionCard>
  );
};
