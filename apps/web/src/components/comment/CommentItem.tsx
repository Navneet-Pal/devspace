"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuthStore } from "@/store/auth";

import { useProjectMembers } from "@/hooks/projectMember/useProjectMember";
import { useDeleteComment, useUpdateComment } from "@/hooks/comment/useComment";

import type { ProjectRole } from "@/services/projectMember/types";
import type { Comment } from "@/services/comment/types";

import { commentKeys } from "@/services/comment/keys";

import {
  hasProjectPermission,
  PROJECT_PERMISSION,
} from "@/utils/projectPermission";
import { activityKeys } from "@/services/activity/keys";

interface CommentItemProps {
  comment: Comment;
  workspaceId: string;
  projectId: string;
  taskId?: string;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const CommentItem = ({
  comment,
  workspaceId,
  projectId,
  taskId,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [editContent, setEditContent] = useState(comment.content);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const { data: projectMembersData } = useProjectMembers(
    workspaceId,
    projectId,
  );

  const projectMembers = projectMembersData?.data ?? [];

  const currentProjectMember = user
    ? projectMembers.find((member) => member.userId._id === user._id)
    : undefined;

  const projectRole: ProjectRole | undefined = currentProjectMember?.role;

  const isAuthor = user?._id === comment.authorId._id;

  const hasUpdatePermission =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.COMMENT_UPDATE);

  const hasDeletePermission =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.COMMENT_DELETE);

  const canEdit =
    hasUpdatePermission && (isAuthor || projectRole === "PROJECT_ADMIN");

  const canDelete =
    hasDeletePermission && (isAuthor || projectRole === "PROJECT_ADMIN");

  const updateComment = useUpdateComment();

  const deleteComment = useDeleteComment();

  const isUpdating = updateComment.isPending;

  const isDeleting = deleteComment.isPending;

  /*
   * Build a map of mentioned user IDs
   * to their names.
   */
  const mentionedUsers = useMemo(() => {
    if (!comment.mentions || comment.mentions.length === 0) {
      return [];
    }

    return comment.mentions
      .map((userId) =>
        projectMembers.find((member) => member.userId._id === userId),
      )
      .filter((member): member is (typeof projectMembers)[number] =>
        Boolean(member),
      )
      .map((member) => ({
        id: member.userId._id,
        name: member.userId.name,
      }))
      .sort((a, b) => b.name.length - a.name.length);
  }, [comment.mentions, projectMembers]);

  /*
   * Render comment content with known
   * mentions highlighted.
   */
  const renderedContent = useMemo(() => {
    if (mentionedUsers.length === 0) {
      return comment.content;
    }

    const namesPattern = mentionedUsers
      .map((user) => escapeRegExp(`@${user.name}`))
      .join("|");

    if (!namesPattern) {
      return comment.content;
    }

    const regex = new RegExp(`(${namesPattern})`, "g");

    const parts = comment.content.split(regex);

    return parts.map((part, index) => {
      const isMention = mentionedUsers.some((user) => part === `@${user.name}`);

      if (!isMention) {
        return <span key={index}>{part}</span>;
      }

      return (
        <span
          key={index}
          className="rounded-md bg-primary/10 px-1 py-0.5 font-medium text-primary"
        >
          {part}
        </span>
      );
    });
  }, [comment.content, mentionedUsers]);

  const handleEdit = () => {
    const trimmedContent = editContent.trim();

    if (!trimmedContent || !canEdit || trimmedContent === comment.content) {
      setIsEditing(false);
      setEditContent(comment.content);
      return;
    }

    updateComment.mutate(
      {
        workspaceId,
        projectId,
        commentId: comment._id,
        data: {
          content: trimmedContent,
          mentions: comment.mentions ?? [],
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: taskId
              ? commentKeys.taskList(workspaceId, projectId, taskId)
              : commentKeys.projectList(workspaceId, projectId),
          });
          
          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          if (taskId) {
            queryClient.invalidateQueries({
              queryKey: activityKeys.taskList(workspaceId, projectId, taskId),
            });
          }

          setIsEditing(false);
        },
      },
    );
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!canDelete) {
      return;
    }

    deleteComment.mutate(
      {
        workspaceId,
        projectId,
        commentId: comment._id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: taskId
              ? commentKeys.taskList(workspaceId, projectId, taskId)
              : commentKeys.projectList(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          if (taskId) {
            queryClient.invalidateQueries({
              queryKey: activityKeys.taskList(workspaceId, projectId, taskId),
            });
          }

          setDeleteOpen(false);
        },
      },
    );
  };

  return (
    <>
      <Card className="border-border/60 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              {comment.authorId.avatar && (
                <AvatarImage
                  src={comment.authorId.avatar}
                  alt={comment.authorId.name}
                />
              )}

              <AvatarFallback>
                {getInitials(comment.authorId.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-medium">
                      {comment.authorId.name}
                    </p>

                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>

                    {comment.updatedAt !== comment.createdAt && (
                      <Badge variant="secondary" className="h-5 text-[10px]">
                        edited
                      </Badge>
                    )}
                  </div>
                </div>

                {(canEdit || canDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />

                          <span className="sr-only">Comment actions</span>
                        </Button>
                      }
                    />

                    <DropdownMenuContent align="end">
                      {canEdit && (
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}

                      {canDelete && (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteOpen(true)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                rows={4}
                disabled={isUpdating}
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleEdit}
                  disabled={!editContent.trim() || isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-6">
              {renderedContent}
            </p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete comment?</AlertDialogTitle>

            <AlertDialogDescription>
              This comment will be removed from the conversation. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Comment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
