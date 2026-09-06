import { Document, Types } from "mongoose";

export const GIT_PROVIDER = {
  GITHUB: "github",
} as const;

export type GitProvider = (typeof GIT_PROVIDER)[keyof typeof GIT_PROVIDER];

export interface IProjectGitIntegration extends Document {
  projectId: Types.ObjectId;
  provider: GitProvider;

  installationId: number;

  repositoryId?: number | null;
  repositoryName?: string | null;
  repositoryFullName?: string | null;
  repositoryOwner?: string | null;
  repositoryUrl?: string | null;

  defaultBranch?: string | null;

  connectedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectGitOAuthState extends Document {
  state: string;
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

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

export interface ConnectRepositoryInput {
  repositoryId: number;
}

export interface ProjectGitSummary {
  connected: boolean;

  provider: GitProvider;

  installationId?: number;

  repository?: {
    id: number;
    name: string;
    fullName: string;
    owner: string;
    url: string;
    private: boolean;
    defaultBranch: string | null;
  } | null;

  connectedBy?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
