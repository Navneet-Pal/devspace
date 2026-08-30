"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Search, UserPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUserSearch } from "@/hooks/auth/useUserSearch";
import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";
import { useCreateInvitation } from "@/hooks/workspaceInvitation/workspaceInvitation";

import { workspaceInvitationKeys } from "@/services/workspaceInvitation/keys";
import type { InvitationRole } from "@/services/workspaceInvitation/types";

import type { AuthUser } from "@/services/auth/types";

interface InviteMemberDialogProps {
  workspaceId: string;
}

type InviteRole = Exclude<InvitationRole, "OWNER">;

export const InviteMemberDialog = ({
  workspaceId,
}: InviteMemberDialogProps) => {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);

  const [role, setRole] = useState<InviteRole>("MEMBER");

  const queryClient = useQueryClient();

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useUserSearch(debouncedSearch);

  const { data: workspaceMembersData, isLoading: isMembersLoading } =
    useWorkspaceMembers(workspaceId);

  const createInvitation = useCreateInvitation();

  const workspaceMembers = workspaceMembersData?.data ?? [];

  /*
   * Debounce search input so we don't hit
   * the API on every single keystroke.
   */
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search]);

  /*
   * Users who are already members should not
   * appear as invite candidates.
   */
  const existingMemberIds = useMemo(() => {
    return new Set(workspaceMembers.map((member) => member.userId._id));
  }, [workspaceMembers]);

  const users = useMemo(() => {
    const results = searchData?.data ?? [];

    return results.filter((user) => !existingMemberIds.has(user._id));
  }, [searchData, existingMemberIds]);

  const resetForm = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedUser(null);
    setRole("MEMBER");
    setOpen(false);
  };

  const handleSelectUser = (user: AuthUser) => {
    setSelectedUser(user);
    setSearch(user.email);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedUser) {
      return;
    }

    createInvitation.mutate(
      {
        workspaceId,
        data: {
          userId: selectedUser._id,
          role,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workspaceInvitationKeys.list(workspaceId),
          });

          queryClient.invalidateQueries({
            queryKey: workspaceInvitationKeys.my(),
          });

          resetForm();
        },
      },
    );
  };

  const showRecommendations = search.trim().length >= 2 && !selectedUser;

  const isSearching = isSearchLoading || isSearchFetching;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        }
      />

      <DialogContent className="overflow-visible sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>

          <DialogDescription>
            Search for a DevSpace user and send them a workspace invitation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Search */}
          <div className="space-y-2">
            <label htmlFor="invite-user-search" className="text-sm font-medium">
              User
            </label>

            {selectedUser ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                    />

                    <AvatarFallback>
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {selectedUser.name}
                      </p>

                      <Check className="h-4 w-4 shrink-0" />
                    </div>

                    <p className="truncate text-xs text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(null);
                    setSearch("");
                    setDebouncedSearch("");
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="invite-user-search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                  placeholder="Search by name or email..."
                  className="pl-9"
                  autoComplete="off"
                />

                {showRecommendations && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-lg border bg-popover shadow-md">
                    {isSearching ? (
                      <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                        Searching users...
                      </div>
                    ) : users.length === 0 ? (
                      <div className="px-3 py-4 text-center">
                        <p className="text-sm font-medium">No users found</p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Try a different name or email.
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto p-1">
                        {users.map((user) => (
                          <button
                            key={user._id}
                            type="button"
                            onClick={() => handleSelectUser(user)}
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent"
                          >
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarImage src={user.avatar} alt={user.name} />

                              <AvatarFallback>
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {user.name}
                              </p>

                              <p className="truncate text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!selectedUser && (
              <p className="text-xs text-muted-foreground">
                Type at least 2 characters to search.
              </p>
            )}

            {isMembersLoading && (
              <p className="text-xs text-muted-foreground">
                Checking workspace members...
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace role</label>

            <Select
              value={role}
              onValueChange={(value) => {
                if (value !== null) {
                  setRole(value as InviteRole);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>

                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createInvitation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!selectedUser || createInvitation.isPending}
            >
              {createInvitation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
