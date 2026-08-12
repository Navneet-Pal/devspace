import { ApiResponse } from "@/types/apiTypes";

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateWorkspaceResponse =
  ApiResponse<Workspace>;

export type GetWorkspaceResponse =
  ApiResponse<Workspace>;

export type GetMyWorkspacesResponse =
  ApiResponse<Workspace[]>;

export type UpdateWorkspaceResponse =
  ApiResponse<Workspace>;

export type DeleteWorkspaceResponse =
  ApiResponse<null>;

export type UpdateWorkspaceLogoResponse =
  ApiResponse<Workspace>;