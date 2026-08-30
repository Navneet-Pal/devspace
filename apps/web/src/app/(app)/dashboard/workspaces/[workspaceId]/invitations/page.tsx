"use client";

import { use, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Mail, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { InvitationItem } from "@/components/dashboard/InvitationItem";
import { InviteMemberDialog } from "@/components/workspace/invitations/InviteMemberDialog";

import {
  useCancelInvitation,
  useWorkspaceInvitations,
} from "@/hooks/workspaceInvitation/workspaceInvitation";

import { workspaceInvitationKeys } from "@/services/workspaceInvitation/keys";

interface InvitationsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

type InvitationFilter = "ALL" | "PENDING" | "HISTORY";

export default function InvitationsPage({ params }: InvitationsPageProps) {
  const { workspaceId } = use(params);

  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<InvitationFilter>("PENDING");

  const { data, isLoading, isError } = useWorkspaceInvitations(workspaceId);

  const cancelInvitation = useCancelInvitation();

  const invitations = data?.data ?? [];

  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === "PENDING",
  );

  const historyInvitations = invitations.filter(
    (invitation) => invitation.status !== "PENDING",
  );

  const visibleInvitations = useMemo(() => {
    switch (filter) {
      case "ALL":
        return invitations;

      case "HISTORY":
        return historyInvitations;

      case "PENDING":
      default:
        return pendingInvitations;
    }
  }, [filter, invitations, historyInvitations, pendingInvitations]);

  const handleCancel = (invitationId: string) => {
    cancelInvitation.mutate(invitationId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: workspaceInvitationKeys.list(workspaceId),
        });
      },
    });
  };

  const formatStatus = (status: string) => {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase());
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return null;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle2 className="h-3.5 w-3.5" />;

      case "PENDING":
        return <Clock3 className="h-3.5 w-3.5" />;

      case "REJECTED":
      case "CANCELLED":
      default:
        return <XCircle className="h-3.5 w-3.5" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "default" as const;

      case "PENDING":
        return "secondary" as const;

      case "REJECTED":
      case "CANCELLED":
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        <Button
          type="button"
          size="sm"
          variant={filter === "ALL" ? "default" : "ghost"}
          onClick={() => setFilter("ALL")}
        >
          All
          <span className="ml-1.5 text-xs opacity-70">
            {invitations.length}
          </span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant={filter === "PENDING" ? "default" : "ghost"}
          onClick={() => setFilter("PENDING")}
        >
          Pending
          <span className="ml-1.5 text-xs opacity-70">
            {pendingInvitations.length}
          </span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant={filter === "HISTORY" ? "default" : "ghost"}
          onClick={() => setFilter("HISTORY")}
        >
          History
          <span className="ml-1.5 text-xs opacity-70">
            {historyInvitations.length}
          </span>
        </Button>
      </div>

      {/* Invitation List */}
      <Card>
        <CardContent className="p-0">
          {/* Loading */}
          {isLoading && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Loading invitations...
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="p-6 text-center text-sm text-destructive">
              Failed to load invitations.
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && visibleInvitations.length === 0 && (
            <div className="p-10 text-center">
              <Mail className="mx-auto h-9 w-9 text-muted-foreground" />

              <p className="mt-3 font-medium">
                {filter === "PENDING"
                  ? "No pending invitations"
                  : filter === "HISTORY"
                    ? "No invitation history"
                    : "No invitations"}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {filter === "PENDING"
                  ? "Invite people to collaborate in your workspace."
                  : "Invitations will appear here as they are created."}
              </p>
            </div>
          )}

          {/* Invitations */}
          {!isLoading && !isError && visibleInvitations.length > 0 && (
            <div className="divide-y">
              {visibleInvitations.map((invitation) => {
                const isPending = invitation.status === "PENDING";

                const sentDate = formatDate(
                  "createdAt" in invitation ? invitation.createdAt : undefined,
                );

                /*
                 * PENDING
                 *
                 * InvitationItem owns:
                 * - Pending badge
                 * - Cancel button
                 * - recipient information
                 * - sent date
                 */
                if (isPending) {
                  return (
                    <div key={invitation._id} className="p-3">
                      <InvitationItem
                        name={invitation.userId.name}
                        email={invitation.userId.email}
                        avatar={invitation.userId.avatar}
                        sentDate={sentDate ?? undefined}
                        status={invitation.status}
                        onCancel={() => handleCancel(invitation._id)}
                        isCancelling={cancelInvitation.isPending}
                      />
                    </div>
                  );
                }

                /*
                 * HISTORY
                 *
                 * History does not need
                 * Cancel action.
                 */
                return (
                  <div
                    key={invitation._id}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Avatar */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-medium">
                        {invitation.userId.name?.charAt(0)?.toUpperCase() ??
                          "U"}
                      </div>

                      {/* User Information */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {invitation.userId.name}
                        </p>

                        <p className="truncate text-sm text-muted-foreground">
                          {invitation.userId.email}
                        </p>

                        {sentDate && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Sent {sentDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* History Status */}
                    <Badge
                      variant={getStatusVariant(invitation.status)}
                      className="shrink-0 gap-1"
                    >
                      {getStatusIcon(invitation.status)}

                      {formatStatus(invitation.status)}
                    </Badge>
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
