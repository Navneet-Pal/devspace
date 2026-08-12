"use client";

import { use } from "react";
import { Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { InvitationItem } from "@/components/dashboard/InvitationItem";
import { InviteMemberDialog } from "@/components/workspace/invitations/InviteMemberDialog";
import {
  useCancelInvitation,
  useWorkspaceInvitations,
} from "@/hooks/workspaceInvitation/workspaceInvitation";
import { useQueryClient } from "@tanstack/react-query";

interface InvitationsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default function InvitationsPage({ params }: InvitationsPageProps) {
  const { workspaceId } = use(params);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useWorkspaceInvitations(workspaceId);

  const cancelInvitation = useCancelInvitation();

  const invitations =
    data?.data?.filter((invitation) => invitation.status === "PENDING") ?? [];

  const handleCancel = (invitationId: string) => {
    cancelInvitation.mutate(invitationId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: workspaceInvitationKeys.list(workspaceId),
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6" />

            <h1 className="text-2xl font-semibold">Invitations</h1>
          </div>

          <p className="mt-1 text-muted-foreground">
            Manage invitations sent to people in your workspace.
          </p>
        </div>

        <InviteMemberDialog workspaceId={workspaceId} />
      </div>

      {/* Invitations Card */}
      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Loading invitations...
            </div>
          )}

          {isError && (
            <div className="p-6 text-center text-sm text-destructive">
              Failed to load invitations.
            </div>
          )}

          {!isLoading && !isError && invitations.length === 0 && (
            <div className="p-8 text-center">
              <Mail className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 font-medium">No pending invitations</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Invite people to collaborate in your workspace.
              </p>
            </div>
          )}

          {!isLoading && !isError && invitations.length > 0 && (
            <div className="divide-y">
              {invitations.map((invitation) => (
                <div key={invitation._id} className="p-2">
                  <InvitationItem
                    name={invitation.userId.name}
                    email={invitation.userId.email}
                    avatar={invitation.userId.avatar}
                    onCancel={() => handleCancel(invitation._id)}
                    isCancelling={cancelInvitation.isPending}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
