"use client";

import { use } from "react";
import { MoreHorizontal, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useRemoveMember,
  useUpdateMemberRole,
  useWorkspaceMembers,
} from "@/hooks/workspaceMember/useWorkspaceMember";
import { useQueryClient } from "@tanstack/react-query";
import { workspaceMemberKeys } from "@/services/workspaceMember/keys";

interface MembersPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default function MembersPage({ params }: MembersPageProps) {
  const { workspaceId } = use(params);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useWorkspaceMembers(workspaceId);

  const updateMemberRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const members = data?.data ?? [];

  const handleRemoveMember = (memberId: string) => {
    removeMember.mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workspaceMemberKeys.list(workspaceId),
          });
        },
      },
    );
  };

  const handleRoleChange = (
    memberId: string,
    currentRole: "OWNER" | "ADMIN" | "MEMBER",
  ) => {
    const newRole = currentRole === "ADMIN" ? "MEMBER" : "ADMIN";

    updateMemberRole.mutate(
      {
        workspaceId,
        memberId,
        data: {
          role: newRole,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workspaceMemberKeys.list(workspaceId),
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading members...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-destructive">Failed to load members.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />

          <h1 className="text-2xl font-semibold">Members</h1>
        </div>

        <p className="mt-1 text-muted-foreground">
          Manage people in your workspace.
        </p>
      </div>

      {/* Members */}
      <Card>
        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No members found.
            </div>
          ) : (
            <div className="divide-y">
              {members.map((member) => {
                const role =
                  member.role === "OWNER"
                    ? "Owner"
                    : member.role === "ADMIN"
                      ? "Admin"
                      : "Member";

                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4"
                  >
                    {/* Member Info */}
                    <div>
                      <p className="font-medium">{member.userId.name}</p>

                      <p className="text-sm text-muted-foreground">
                        {member.userId.email}
                      </p>
                    </div>

                    {/* Role + Actions */}
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={role === "Owner" ? "default" : "secondary"}
                      >
                        {role}
                      </Badge>

                      {/* Owner cannot be modified */}
                      {member.role !== "OWNER" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            {/* Change Role */}
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(member._id, member.role)
                              }
                              disabled={updateMemberRole.isPending}
                            >
                              {member.role === "ADMIN"
                                ? "Make Member"
                                : "Make Admin"}
                            </DropdownMenuItem>

                            {/* Remove Member */}
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member._id)}
                              disabled={removeMember.isPending}
                              className="text-destructive focus:text-destructive"
                            >
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
