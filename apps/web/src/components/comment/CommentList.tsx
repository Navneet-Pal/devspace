"use client";

import { MessageSquare } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { CommentItem } from "./CommentItem";

import type { Comment } from "@/services/comment/types";

interface CommentListProps {
  comments: Comment[];
  workspaceId: string;
  projectId: string;
  taskId?: string;
  isLoading?: boolean;
  isError?: boolean;
}

export const CommentList = ({
  comments,
  workspaceId,
  projectId,
  taskId,
  isLoading = false,
  isError = false,
}: CommentListProps) => {
  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-none">
        <CardContent className="flex min-h-[160px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 shadow-none">
        <CardContent className="flex min-h-[160px] items-center justify-center">
          <p className="text-sm text-destructive">Failed to load comments.</p>
        </CardContent>
      </Card>
    );
  }

  if (comments.length === 0) {
    return (
      <Card className="border-dashed shadow-none">
        <CardContent className="flex min-h-[160px] flex-col items-center justify-center text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground/60" />

          <p className="mt-3 text-sm font-medium">No comments yet</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Start the conversation by adding a comment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          workspaceId={workspaceId}
          projectId={projectId}
          taskId={taskId}
        />
      ))}
    </div>
  );
};
