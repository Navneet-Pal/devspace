"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Mail, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  useAcceptInvitation,
  useMyInvitations,
  useRejectInvitation,
} from "@/hooks/workspaceInvitation/workspaceInvitation";

export default function InvitationsPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useMyInvitations();

  const acceptInvitation = useAcceptInvitation();
  const rejectInvitation = useRejectInvitation();

  const [processingInvitationId, setProcessingInvitationId] = useState<
    string | null
  >(null);

  const invitations =
    data?.data?.filter((invitation) => invitation.status === "PENDING") ?? [];

  const handleAccept = (invitationId: string) => {
    const invitation = invitations.find((item) => item._id === invitationId);

    if (!invitation) {
      return;
    }

    setProcessingInvitationId(invitationId);

    acceptInvitation.mutate(invitationId, {
      onSuccess: () => {
        router.push(`/dashboard/workspaces/${invitation.workspaceId._id}`);
      },
      onSettled: () => {
        setProcessingInvitationId(null);
      },
    });
  };

  const handleReject = (invitationId: string) => {
    setProcessingInvitationId(invitationId);

    rejectInvitation.mutate(invitationId, {
      onSettled: () => {
        setProcessingInvitationId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6" />

          <h1 className="text-2xl font-semibold">Invitations</h1>
        </div>

        <p className="mt-1 text-muted-foreground">
          Manage workspace invitations you have received.
        </p>
      </div>

      {/* Invitations */}
      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading invitations...
            </div>
          )}

          {isError && (
            <div className="p-8 text-center text-sm text-destructive">
              Failed to load invitations.
            </div>
          )}

          {!isLoading && !isError && invitations.length === 0 && (
            <div className="p-10 text-center">
              <Mail className="mx-auto h-9 w-9 text-muted-foreground" />

              <p className="mt-3 font-medium">No pending invitations</p>

              <p className="mt-1 text-sm text-muted-foreground">
                You do not have any workspace invitations waiting for you.
              </p>
            </div>
          )}

          {!isLoading && !isError && invitations.length > 0 && (
            <div className="divide-y">
              {invitations.map((invitation) => {
                const isProcessing = processingInvitationId === invitation._id;

                const workspaceName =
                  invitation.workspaceId.name || "Workspace";

                const inviterName =
                  invitation.invitedBy.name || "Workspace admin";

                return (
                  <div
                    key={invitation._id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarImage
                          src={invitation.workspaceId.avatar?.url}
                          alt={workspaceName}
                        />

                        <AvatarFallback>
                          {workspaceName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium">
                            {workspaceName}
                          </p>

                          <Badge variant="secondary">{invitation.role}</Badge>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Invited by {inviterName}
                        </p>

                        {invitation.invitedBy.email && (
                          <p className="text-xs text-muted-foreground">
                            {invitation.invitedBy.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(invitation._id)}
                        disabled={isProcessing}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleAccept(invitation._id)}
                        disabled={isProcessing}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Accept
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
