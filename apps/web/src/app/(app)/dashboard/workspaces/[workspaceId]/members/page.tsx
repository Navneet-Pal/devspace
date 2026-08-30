"use client";

import { use, useMemo, useState } from "react";
import { MoreHorizontal, Search, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { InviteMemberDialog } from "@/components/workspace/invitations/InviteMemberDialog";

import {
  useRemoveMember,
  useUpdateMemberRole,
  useWorkspaceMembers,
} from "@/hooks/workspaceMember/useWorkspaceMember";

import { workspaceMemberKeys } from "@/services/workspaceMember/keys";

import { useAuthStore } from "@/store/auth";

interface MembersPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

type RoleFilter = "ALL" | "OWNER" | "ADMIN" | "MEMBER";

export default function MembersPage({ params }: MembersPageProps) {
  const { workspaceId } = use(params);

  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError } = useWorkspaceMembers(workspaceId);

  const updateMemberRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const members = data?.data ?? [];

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  const currentMember = user
    ? members.find((member) => member.userId._id === user._id)
    : undefined;

  const canManageMembers =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const isCurrentUserAdmin = currentMember?.role === "ADMIN";
  const isCurrentUserOwner = currentMember?.role === "OWNER";

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        member.userId.name.toLowerCase().includes(query) ||
        member.userId.email.toLowerCase().includes(query);

      const matchesRole = roleFilter === "ALL" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  const adminCount = members.filter((member) => member.role === "ADMIN").length;

  const memberCount = members.filter(
    (member) => member.role === "MEMBER",
  ).length;

  const hasFilters = search.trim() !== "" || roleFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
  };

  const handleRemoveMember = (memberId: string) => {
    if (!canManageMembers) {
      return;
    }

    const targetMember = members.find((member) => member._id === memberId);

    if (!targetMember) {
      return;
    }

    // Nobody can remove themselves.
    if (targetMember.userId._id === user?._id) {
      return;
    }

    // Admin cannot remove another Admin.
    if (isCurrentUserAdmin && targetMember.role === "ADMIN") {
      return;
    }

    // Owner cannot be removed.
    if (targetMember.role === "OWNER") {
      return;
    }

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
    if (!canManageMembers) {
      return;
    }

    const targetMember = members.find((member) => member._id === memberId);

    if (!targetMember) {
      return;
    }

    // Nobody can change their own role.
    if (targetMember.userId._id === user?._id) {
      return;
    }

    // Owner role cannot be changed.
    if (targetMember.role === "OWNER") {
      return;
    }

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
        <p className="text-sm text-muted-foreground">Loading members...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground/60" />

          <p className="mt-3 text-sm font-medium">Failed to load members.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />

            <h1 className="text-2xl font-semibold">Members</h1>
          </div>

          <p className="mt-1 text-muted-foreground">
            Manage people in your workspace.
          </p>
        </div>

        {canManageMembers && <InviteMemberDialog workspaceId={workspaceId} />}
      </div>

      {/* Summary */}
      {members.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="border-border/60 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total members</p>

              <p className="mt-1 text-2xl font-semibold">{members.length}</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Admins</p>

              <p className="mt-1 text-2xl font-semibold">{adminCount}</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Members</p>

              <p className="mt-1 text-2xl font-semibold">{memberCount}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {members.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search members..."
              className="pl-9"
            />
          </div>

          <Select
            value={roleFilter}
            onValueChange={(value) => {
              if (value !== null) {
                setRoleFilter(value as RoleFilter);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-[170px]">
              <SelectValue>
                {(value) => {
                  switch (value) {
                    case "OWNER":
                      return "Owner";
                    case "ADMIN":
                      return "Admin";
                    case "MEMBER":
                      return "Member";
                    default:
                      return "All roles";
                  }
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              <SelectItem value="OWNER">Owner</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Members */}
      <Card className="border-border/60 shadow-none">
        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-muted p-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">No members yet</h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Invite people to start collaborating in this workspace.
              </p>

              {canManageMembers && (
                <div className="mt-4">
                  <InviteMemberDialog workspaceId={workspaceId} />
                </div>
              )}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-muted p-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">No members found</h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                No member matches your current search or role filter.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {filteredMembers.map((member) => {
                const isCurrentUser = member.userId._id === user?._id;

                const isTargetAdmin = member.role === "ADMIN";

                const canManageTarget =
                  canManageMembers &&
                  !isCurrentUser &&
                  member.role !== "OWNER" &&
                  (isCurrentUserOwner ||
                    (isCurrentUserAdmin && !isTargetAdmin));

                const role =
                  member.role === "OWNER"
                    ? "Owner"
                    : member.role === "ADMIN"
                      ? "Admin"
                      : "Member";

                return (
                  <div
                    key={member._id}
                    className="flex flex-col gap-4 p-4 transition-colors hover:bg-accent/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-11 w-11 shrink-0">
                        <AvatarImage
                          src={member.userId.avatar}
                          alt={member.userId.name}
                        />

                        <AvatarFallback>
                          {member.userId.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium">
                            {member.userId.name}
                          </p>

                          {isCurrentUser && (
                            <Badge variant="outline" className="text-[11px]">
                              You
                            </Badge>
                          )}

                          {member.role === "OWNER" && (
                            <Badge variant="outline" className="text-[11px]">
                              Workspace owner
                            </Badge>
                          )}
                        </div>

                        <p className="truncate text-sm text-muted-foreground">
                          {member.userId.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <Badge
                        variant={
                          member.role === "OWNER" ? "default" : "secondary"
                        }
                      >
                        {role}
                      </Badge>

                      {canManageTarget && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Actions for ${member.userId.name}`}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            }
                          />

                          <DropdownMenuContent align="end">
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
