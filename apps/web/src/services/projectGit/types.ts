import type { ApiResponse } from "@/types/apiTypes";

export type GitProvider = "github";

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  default_branch: string | null;

  owner: {
    login: string;
    avatar_url?: string;
  };
}

export interface GitHubBranch {
  name: string;

  commit: {
    sha: string;
    url: string;
  };

  protected: boolean;
}

export interface GitHubCommit {
  sha: string;
  html_url: string;

  commit: {
    message: string;

    author: {
      name: string | null;
      email: string | null;
      date: string | null;
    };
  };

  author: {
    login: string;
    avatar_url?: string;
  } | null;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;

  user: {
    login: string;
    avatar_url?: string;
  };

  head: {
    ref: string;
  };

  base: {
    ref: string;
  };
}

export interface ProjectGitRepository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  private?: boolean;
  defaultBranch: string | null;
}

export interface ProjectGitSummary {
  connected: boolean;
  provider: GitProvider;
  installationId?: number;

  repository?: ProjectGitRepository | null;

  connectedBy?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface ConnectRepositoryRequest {
  repositoryId: number;
}

export type GetProjectGitResponse = ApiResponse<ProjectGitSummary>;

export type GetGitHubRepositoriesResponse = ApiResponse<{
  total_count: number;
  repositories: GitHubRepository[];
}>;

export type GetBranchesResponse = ApiResponse<GitHubBranch[]>;

export type GetCommitsResponse = ApiResponse<GitHubCommit[]>;

export type GetPullRequestsResponse = ApiResponse<GitHubPullRequest[]>;

export type CreateGitHubInstallResponse = ApiResponse<{
  url: string;
}>;

export type ConnectRepositoryResponse = ApiResponse<ProjectGitSummary>;

export type DisconnectGitHubResponse = ApiResponse<null>;
