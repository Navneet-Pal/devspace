import { axiosInstance } from "@/lib/axios";

import type {
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentResponse,
  GetCommentsResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from "./types";

class CommentService {
  async getProjectComments(
    workspaceId: string,
    projectId: string,
  ): Promise<GetCommentsResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/comments`,
    );

    return response.data;
  }

  async getTaskComments(
    workspaceId: string,
    projectId: string,
    taskId: string,
  ): Promise<GetCommentsResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`,
    );

    return response.data;
  }

  async createProjectComment(
    workspaceId: string,
    projectId: string,
    data: CreateCommentRequest,
  ): Promise<CreateCommentResponse> {
    const response = await axiosInstance.post(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/comments`,
      data,
    );

    return response.data;
  }

  async createTaskComment(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: CreateCommentRequest,
  ): Promise<CreateCommentResponse> {
    const response = await axiosInstance.post(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`,
      data,
    );

    return response.data;
  }

  async updateComment(
    workspaceId: string,
    projectId: string,
    commentId: string,
    data: UpdateCommentRequest,
  ): Promise<UpdateCommentResponse> {
    const response = await axiosInstance.patch(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/comments/${commentId}`,
      data,
    );

    return response.data;
  }

  async deleteComment(
    workspaceId: string,
    projectId: string,
    commentId: string,
  ): Promise<DeleteCommentResponse> {
    const response = await axiosInstance.delete(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/comments/${commentId}`,
    );

    return response.data;
  }
}

export const commentService = new CommentService();
