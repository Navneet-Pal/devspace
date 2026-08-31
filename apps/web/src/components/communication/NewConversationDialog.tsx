"use client";

import { useEffect, useState } from "react";
import { Check, MessageCircle, Search, UserPlus, Users, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { communicationService } from "@/services/communication/service";
import { communicationKeys } from "@/services/communication/keys";

import type { UserSearchResult } from "@/services/communication/types";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

type ConversationMode = "DIRECT" | "GROUP";

export const NewConversationDialog = ({
  open,
  onOpenChange,
  onConversationCreated,
}: NewConversationDialogProps) => {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<ConversationMode>("DIRECT");

  const [query, setQuery] = useState("");

  const [users, setUsers] = useState<UserSearchResult[]>([]);

  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);

  const [groupName, setGroupName] = useState("");

  const [isSearching, setIsSearching] = useState(false);

  const [isCreating, setIsCreating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * Reset dialog
   */

  useEffect(() => {
    if (!open) {
      setMode("DIRECT");
      setQuery("");
      setUsers([]);
      setSelectedUsers([]);
      setGroupName("");
      setError(null);
      setIsSearching(false);
      setIsCreating(false);
    }
  }, [open]);

  /*
   * Search users
   */

  useEffect(() => {
    if (!open) {
      return;
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setUsers([]);
      setError(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        setError(null);

        const response = await communicationService.searchUsers(trimmedQuery);

        setUsers(response);
      } catch {
        setUsers([]);
        setError("Unable to search users. Please try again.");
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, open]);

  /*
   * Direct conversation
   */

  const handleSelectDirectUser = async (userId: string) => {
    try {
      setIsCreating(true);
      setError(null);

      const conversation = await communicationService.createDirectConversation({
        participantId: userId,
      });

      await queryClient.invalidateQueries({
        queryKey: communicationKeys.conversations(),
      });

      onConversationCreated(conversation._id);
      onOpenChange(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create conversation.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  /*
   * Toggle group user
   */

  const handleToggleGroupUser = (user: UserSearchResult) => {
    setError(null);

    const alreadySelected = selectedUsers.some(
      (selectedUser) => selectedUser._id === user._id,
    );

    if (alreadySelected) {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser._id !== user._id),
      );

      return;
    }

    setSelectedUsers([...selectedUsers, user]);
  };

  /*
   * Remove selected group user
   */

  const handleRemoveSelectedUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  /*
   * Create group
   */

  const handleCreateGroup = async () => {
    const trimmedName = groupName.trim();

    if (!trimmedName) {
      setError("Group name is required.");
      return;
    }

    if (selectedUsers.length < 2) {
      setError("Select at least 2 members to create a group.");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const conversation = await communicationService.createGroupConversation({
        name: trimmedName,
        participantIds: selectedUsers.map((user) => user._id),
      });

      await queryClient.invalidateQueries({
        queryKey: communicationKeys.conversations(),
      });

      onConversationCreated(conversation._id);
      onOpenChange(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create group.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  /*
   * Selected user helper
   */

  const isUserSelected = (userId: string) => {
    return selectedUsers.some((user) => user._id === userId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "DIRECT" ? "New Direct Conversation" : "Create Group"}
          </DialogTitle>

          <DialogDescription>
            {mode === "DIRECT"
              ? "Search for a DevSpace user to start a conversation."
              : "Create a group and add your team members."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mode Selection */}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("DIRECT");
                setSelectedUsers([]);
                setGroupName("");
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                mode === "DIRECT"
                  ? "border-primary bg-accent"
                  : "hover:bg-accent/50"
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              Direct Message
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("GROUP");
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                mode === "GROUP"
                  ? "border-primary bg-accent"
                  : "hover:bg-accent/50"
              }`}
            >
              <Users className="h-4 w-4" />
              Group Chat
            </button>
          </div>

          {/* Group Name */}

          {mode === "GROUP" && (
            <div className="space-y-2">
              <label htmlFor="group-name" className="text-sm font-medium">
                Group name
              </label>

              <input
                id="group-name"
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="e.g. Development Team"
                maxLength={100}
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {/* Selected Group Members */}

          {mode === "GROUP" && selectedUsers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Selected members ({selectedUsers.length})
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-2 rounded-full border bg-muted px-2 py-1"
                  >
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-background">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <MessageCircle className="h-3 w-3" />
                      )}
                    </div>

                    <span className="max-w-32 truncate text-xs">
                      {user.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedUser(user._id)}
                      disabled={isCreating}
                      className="rounded-full p-0.5 hover:bg-background"
                      aria-label={`Remove ${user.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or email..."
              autoFocus
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Error */}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Search Results */}

          <div className="max-h-64 overflow-y-auto">
            {isSearching ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Searching...
              </p>
            ) : query.trim() && users.length === 0 ? (
              <div className="py-6 text-center">
                <UserPlus className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />

                <p className="text-sm text-muted-foreground">No users found.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {users.map((user) => {
                  const selected = isUserSelected(user._id);

                  return (
                    <button
                      key={user._id}
                      type="button"
                      disabled={isCreating || (mode === "DIRECT" && selected)}
                      onClick={() => {
                        if (mode === "DIRECT") {
                          handleSelectDirectUser(user._id);
                        } else {
                          handleToggleGroupUser(user);
                        }
                      }}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {/* Avatar */}

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <MessageCircle className="h-4 w-4" />
                        )}
                      </div>

                      {/* User Info */}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>

                      {/* Group Selection */}

                      {mode === "GROUP" && (
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}

          <div className="flex items-center justify-between gap-2 border-t pt-4">
            {mode === "GROUP" ? (
              <p className="text-xs text-muted-foreground">
                {selectedUsers.length < 2
                  ? "Select at least 2 members."
                  : `${selectedUsers.length} members selected.`}
              </p>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>

              {mode === "GROUP" && (
                <Button
                  type="button"
                  onClick={handleCreateGroup}
                  disabled={
                    isCreating || !groupName.trim() || selectedUsers.length < 2
                  }
                >
                  {isCreating ? "Creating..." : "Create Group"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
