import { axiosInstance } from "@/lib/axios";

import type {
  ConnectRepositoryRequest,
  ConnectRepositoryResponse,
  CreateGitHubInstallResponse,
  DisconnectGitHubResponse,
  GetBranchesResponse,
  GetCommitsResponse,
  GetGitHubRepositoriesResponse,
  GetProjectGitResponse,
  GetPullRequestsResponse,
} from "./types";

class ProjectGitService {
  async getIntegration(
    workspaceId: string,
    projectId: string,
  ): Promise<GetProjectGitResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/git`,
    );

    return response.data;
  }

  async createGitHubInstallUrl(
    workspaceId: string,
    projectId: string,
  ): Promise<CreateGitHubInstallResponse> {
    const response = await axiosInstance.post(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/git/github/install`,
    );

    return response.data;
  }

  async getRepositories(
    workspaceId: string,
    projectId: string,
  ): Promise<GetGitHubRepositoriesResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/git/github/repositories`,
    );

    return response.data;
  }

  async connectRepository(
    workspaceId: string,
    projectId: string,
    data: ConnectRepositoryRequest,
  ): Promise<ConnectRepositoryResponse> {
    const response = await axiosInstance.post(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/git/github/repository`,
      data,
    );

    return response.data;
  }

  async disconnectGitHub(
    workspaceId: string,
    projectId: string,
  ): Promise<DisconnectGitHubResponse> {
    const response = await axiosInstance.delete(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/git`,
    );

    return response.data;
  }

  async getBranches(
    workspaceId: string,
    projectId: string,
  ): Promise<GetBranchesResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/git/branches`,
    );

    return response.data;
  }

  async getCommits(
    workspaceId: string,
    projectId: string,
  ): Promise<GetCommitsResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/git/commits`,
    );

    return response.data;
  }

  async getPullRequests(
    workspaceId: string,
    projectId: string,
  ): Promise<GetPullRequestsResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/git/pull-requests`,
    );

    return response.data;
  }
}

export const projectGitService = new ProjectGitService();
