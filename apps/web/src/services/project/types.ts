import type { ApiResponse } from "@/types/apiTypes";

export type ProjectStatus = "Active" | "Archived";

export interface Project {
  _id: string;
  workspaceId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export type CreateProjectResponse = ApiResponse<Project>;

export type GetProjectsResponse = ApiResponse<Project[]>;

export type GetProjectResponse = ApiResponse<Project>;

export type UpdateProjectResponse = ApiResponse<Project>;

export type DeleteProjectResponse = ApiResponse<null>;
