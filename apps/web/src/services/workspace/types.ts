import { ApiResponse } from "@/types/apiTypes";

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
}

export interface WorkspaceAvatar {
  publicId?: string | null;
  url?: string | null;
}

export interface Workspace {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;

  avatar?: WorkspaceAvatar | null;

  ownerId: string;

  deletedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export type CreateWorkspaceResponse = ApiResponse<Workspace>;

export type GetWorkspaceResponse = ApiResponse<Workspace>;

export type GetMyWorkspacesResponse = ApiResponse<Workspace[]>;

export type UpdateWorkspaceResponse = ApiResponse<Workspace>;

export type DeleteWorkspaceResponse = ApiResponse<Workspace>;

export type UpdateWorkspaceLogoResponse = ApiResponse<Workspace>;
 