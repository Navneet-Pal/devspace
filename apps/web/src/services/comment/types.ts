import type { ApiResponse } from "@/types/apiTypes";

export interface CommentAuthor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  workspaceId: string;
  projectId: string;
  taskId: string | null;
  authorId: CommentAuthor;
  content: string;
  mentions: string[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  mentions?: string[];
}

export interface UpdateCommentRequest {
  content: string;
  mentions?: string[];
}

export type GetCommentsResponse = ApiResponse<Comment[]>;

export type CreateCommentResponse = ApiResponse<Comment>;

export type UpdateCommentResponse = ApiResponse<Comment>;

export type DeleteCommentResponse = ApiResponse<null>;
