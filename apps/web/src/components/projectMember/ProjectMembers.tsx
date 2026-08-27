"use client";

import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  useProjectMembers,
  useRemoveProjectMember,
  useUpdateProjectMemberRole,
} from "@/hooks/projectMember/useProjectMember";

import { projectMemberKeys } from "@/services/projectMember/keys";

import type { ProjectRole } from "@/services/projectMember/types";
import { useAuthStore } from "@/store/auth";
import { activityKeys } from "@/services/activity/keys";

interface ProjectMembersProps {
  workspaceId: string;
  projectId: string;
}

const roleLabel: Record<ProjectRole, string> = {
  PROJECT_ADMIN: "Admin",
  PROJECT_MEMBER: "Member",
  PROJECT_VIEWER: "Viewer",
};

export const ProjectMembers = ({
  workspaceId,
  projectId,
}: ProjectMembersProps) => {
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError } = useProjectMembers(
    workspaceId,
    projectId,
  );

  const updateRole = useUpdateProjectMemberRole();

  const removeMember = useRemoveProjectMember();

  const members = data?.data ?? [];

  const handleRoleChange = (memberId: string, currentRole: ProjectRole) => {
    const nextRole =
      currentRole === "PROJECT_ADMIN" ? "PROJECT_MEMBER" : "PROJECT_ADMIN";

    updateRole.mutate(
      {
        workspaceId,
        projectId,
        memberId,
        data: {
          role: nextRole,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: projectMemberKeys.list(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });
        },
      },
    );
  };

  const handleRemove = (memberId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member from the project?",
    );

    if (!confirmed) {
      return;
    }

    removeMember.mutate(
      {
        workspaceId,
        projectId,
        memberId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: projectMemberKeys.list(workspaceId, projectId),
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading project members...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-sm text-destructive">
          Failed to load project members.
        </p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border text-center">
        <div className="rounded-full bg-muted p-3">
          <UserRound className="h-6 w-6 text-muted-foreground" />
        </div>

        <h3 className="mt-3 font-medium">No project members</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Add workspace members to this project.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => {
        // Check whether this member is the currently logged-in user
        const isCurrentUser = member.userId._id === user?._id;

        return (
          <div
            key={member._id}
            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.userId.avatar} />

                <AvatarFallback>
                  {member.userId.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">
                    {member.userId.name}
                  </p>

                  {isCurrentUser && (
                    <Badge variant="outline" className="text-xs">
                      You
                    </Badge>
                  )}
                </div>

                <p className="truncate text-xs text-muted-foreground">
                  {member.userId.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">{roleLabel[member.role]}</Badge>

              {/* Don't allow the current user to manage themselves */}
              {!isCurrentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    render=
                    {
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    {member.role !== "PROJECT_VIEWER" && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(member._id, member.role)
                        }
                        disabled={updateRole.isPending}
                      >
                        {member.role === "PROJECT_ADMIN"
                          ? "Make Member"
                          : "Make Admin"}
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={() => handleRemove(member._id)}
                      disabled={removeMember.isPending}
                      className="text-destructive focus:text-destructive"
                    >
                      Remove from project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
