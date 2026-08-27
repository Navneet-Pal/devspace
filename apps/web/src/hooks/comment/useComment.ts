import { useMutation, useQuery } from "@tanstack/react-query";

import { commentKeys } from "@/services/comment/keys";

import { commentService } from "@/services/comment/service";

import type {
  CreateCommentRequest,
  UpdateCommentRequest,
} from "@/services/comment/types";

export const useProjectComments = (workspaceId: string, projectId: string) => {
  return useQuery({
    queryKey: commentKeys.projectList(workspaceId, projectId),

    queryFn: () => commentService.getProjectComments(workspaceId, projectId),

    enabled: !!workspaceId && !!projectId,
  });
};

export const useTaskComments = (
  workspaceId: string,
  projectId: string,
  taskId: string,
) => {
  return useQuery({
    queryKey: commentKeys.taskList(workspaceId, projectId, taskId),

    queryFn: () =>
      commentService.getTaskComments(workspaceId, projectId, taskId),

    enabled: !!workspaceId && !!projectId && !!taskId,
  });
};

export const useCreateProjectComment = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      data: CreateCommentRequest;
    }) => commentService.createProjectComment(workspaceId, projectId, data),
  });
};

export const useCreateTaskComment = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      taskId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      taskId: string;
      data: CreateCommentRequest;
    }) =>
      commentService.createTaskComment(workspaceId, projectId, taskId, data),
  });
};

export const useUpdateComment = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      commentId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      commentId: string;
      data: UpdateCommentRequest;
    }) => commentService.updateComment(workspaceId, projectId, commentId, data),
  });
};

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      commentId,
    }: {
      workspaceId: string;
      projectId: string;
      commentId: string;
    }) => commentService.deleteComment(workspaceId, projectId, commentId),
  });
};
