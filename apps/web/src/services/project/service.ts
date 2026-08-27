import { axiosInstance } from "@/lib/axios";

import type {
  CreateProjectRequest,
  CreateProjectResponse,
  DeleteProjectResponse,
  GetProjectResponse,
  GetProjectsResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
} from "./types";

class ProjectService {
  async createProject(
    workspaceId: string,
    data: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    const response = await axiosInstance.post(
      `/v1/workspaces/${workspaceId}/projects`,
      data,
    );

    return response.data;
  }

  async getWorkspaceProjects(
    workspaceId: string,
  ): Promise<GetProjectsResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects`,
    );

    return response.data;
  }

  async getProject(
    workspaceId: string,
    projectId: string,
  ): Promise<GetProjectResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}`,
    );

    return response.data;
  }

  async updateProject(
    workspaceId: string,
    projectId: string,
    data: UpdateProjectRequest,
  ): Promise<UpdateProjectResponse> {
    const response = await axiosInstance.patch(
      `/v1/workspaces/${workspaceId}/projects/${projectId}`,
      data,
    );

    return response.data;
  }

  async deleteProject(
    workspaceId: string,
    projectId: string,
  ): Promise<DeleteProjectResponse> {
    const response = await axiosInstance.delete(
      `/v1/workspaces/${workspaceId}/projects/${projectId}`,
    );

    return response.data;
  }
}

export const projectService = new ProjectService();
