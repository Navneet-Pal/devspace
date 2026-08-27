"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AtSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useProjectMembers } from "@/hooks/projectMember/useProjectMember";
import { useCreateTaskComment } from "@/hooks/comment/useComment";

import { commentKeys } from "@/services/comment/keys";
import { activityKeys } from "@/services/activity/keys";

interface CommentComposerProps {
  workspaceId: string;
  projectId: string;
  taskId: string;
}

export const CommentComposer = ({
  workspaceId,
  projectId,
  taskId,
}: CommentComposerProps) => {
  const [content, setContent] = useState("");
  const [mentions, setMentions] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const createComment = useCreateTaskComment();

  const { data: projectMembersData } = useProjectMembers(
    workspaceId,
    projectId,
  );

  const projectMembers = projectMembersData?.data ?? [];

  const mentionQuery = useMemo(() => {
    const match = content.match(/(^|\s)@([^\s@]*)$/);

    return match?.[2]?.toLowerCase() ?? "";
  }, [content]);

  const mentionSuggestions = useMemo(() => {
    if (!content.match(/(^|\s)@([^\s@]*)$/)) {
      return [];
    }

    return projectMembers
      .filter((member) => {
        const name = member.userId.name.toLowerCase();

        const email = member.userId.email.toLowerCase();

        return name.includes(mentionQuery) || email.includes(mentionQuery);
      })
      .slice(0, 5);
  }, [content, mentionQuery, projectMembers]);

  const handleMentionSelect = (userId: string, name: string) => {
    const match = content.match(/(^|\s)@([^\s@]*)$/);

    if (!match) {
      return;
    }

    const prefix = content.slice(0, match.index! + match[1].length);

    const nextContent = `${prefix}@${name} `;

    setContent(nextContent);

    setMentions((current) => {
      if (current.includes(userId)) {
        return current;
      }

      return [...current, userId];
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    createComment.mutate(
      {
        workspaceId,
        projectId,
        taskId,
        data: {
          content: trimmedContent,
          mentions,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: commentKeys.taskList(workspaceId, projectId, taskId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.taskList(workspaceId, projectId, taskId),
          });

          setContent("");
          setMentions([]);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a comment... Use @ to mention a member."
          rows={3}
          disabled={createComment.isPending}
        />

        {mentionSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border bg-popover p-1 shadow-md">
            {mentionSuggestions.map((member) => (
              <button
                key={member.userId._id}
                type="button"
                onClick={() =>
                  handleMentionSelect(member.userId._id, member.userId.name)
                }
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
              >
                <AtSign className="h-4 w-4 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="truncate font-medium">{member.userId.name}</p>

                  <p className="truncate text-xs text-muted-foreground">
                    {member.userId.email}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Use @ to mention a project member.
        </p>

        <Button
          type="submit"
          disabled={!content.trim() || createComment.isPending}
        >
          {createComment.isPending ? "Posting..." : "Comment"}
        </Button>
      </div>
    </form>
  );
};
