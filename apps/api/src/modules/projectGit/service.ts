import crypto from "crypto";
import { Types } from "mongoose";

import { StatusCode } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";

import { projectRepository } from "../project/repository.js";
import { projectGitRepository } from "./repository.js";


import { GIT_PROVIDER, type ConnectRepositoryInput } from "./types.js";

import { connectRepositorySchema } from "./validation.js";
import { githubClient } from "../../integrations/github/client.js";

const getWebUrl = () => {
  const url = process.env.WEB_URL;

  if (!url) {
    throw new Error("WEB_URL is not configured.");
  }

  return url;
};

const getGitHubAppSlug = () => {
  const slug = process.env.GITHUB_APP_SLUG;

  if (!slug) {
    throw new Error("GITHUB_APP_SLUG is not configured.");
  }

  return slug;
};

class ProjectGitService {
  private async getProject(workspaceId: string, projectId: string) {
    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new ApiError(StatusCode.NOT_FOUND, "Project not found.");
    }

    if (project.workspaceId.toString() !== workspaceId) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Project does not belong to this workspace.",
      );
    }

    return project;
  }

  private ensureOwner(
    project: {
      createdBy: Types.ObjectId;
    },
    userId: string,
  ) {
    if (project.createdBy.toString() !== userId) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "Only the project owner can manage Git integration.",
      );
    }
  }

  async getIntegration(workspaceId: string, projectId: string) {
    await this.getProject(workspaceId, projectId);

    const integration = await projectGitRepository.findByProjectId(projectId);

    if (!integration) {
      return {
        connected: false,
        provider: GIT_PROVIDER.GITHUB,
        repository: null,
      };
    }

    return {
      connected: Boolean(integration.repositoryId),
      provider: integration.provider,
      installationId: integration.installationId,

      repository: integration.repositoryId
        ? {
            id: integration.repositoryId,
            name: integration.repositoryName!,
            fullName: integration.repositoryFullName!,
            owner: integration.repositoryOwner!,
            url: integration.repositoryUrl!,
            defaultBranch: integration.defaultBranch,
          }
        : null,

      connectedBy:
        typeof integration.connectedBy === "object" &&
        integration.connectedBy !== null &&
        "_id" in integration.connectedBy
          ? String(integration.connectedBy._id)
          : String(integration.connectedBy),

      createdAt: integration.createdAt,
      updatedAt: integration.updatedAt,
    };
  }

  async createGitHubInstallUrl(
    workspaceId: string,
    projectId: string,
    userId: string,
  ) {
    const project = await this.getProject(workspaceId, projectId);

    this.ensureOwner(project, userId);

    const existingIntegration =
      await projectGitRepository.findByProjectId(projectId);

    if (existingIntegration) {
      throw new ApiError(
        StatusCode.CONFLICT,
        "GitHub is already connected to this project.",
      );
    }

    const state = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await projectGitRepository.createOAuthState({
      state,
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(userId),
      expiresAt,
    });

    const appSlug = getGitHubAppSlug();

    const installUrl = `https://github.com/apps/${encodeURIComponent(
      appSlug,
    )}/installations/new?state=${encodeURIComponent(state)}`;

    return {
      url: installUrl,
    };
  }

  async handleGitHubSetup(installationId: number, state: string) {
    if (!installationId) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "GitHub installation ID is missing.",
      );
    }

    if (!state) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "GitHub setup state is missing.",
      );
    }

    const oauthState = await projectGitRepository.findOAuthState(state);

    if (!oauthState) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Invalid or expired GitHub setup state.",
      );
    }

    if (oauthState.expiresAt.getTime() < Date.now()) {
      await projectGitRepository.deleteOAuthState(state);

      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "GitHub setup state has expired.",
      );
    }

    const existingIntegration = await projectGitRepository.findByProjectId(
      oauthState.projectId,
    );

    if (existingIntegration) {
      await projectGitRepository.deleteOAuthState(state);

      throw new ApiError(
        StatusCode.CONFLICT,
        "GitHub is already connected to this project.",
      );
    }

    await projectGitRepository.create({
      projectId: oauthState.projectId,
      provider: GIT_PROVIDER.GITHUB,
      installationId,
      connectedBy: oauthState.userId,
    });

    await projectGitRepository.deleteOAuthState(state);

    return {
      redirectUrl: `${getWebUrl()}/dashboard/workspaces/${await this.getWorkspaceId(
        oauthState.projectId.toString(),
      )}/projects/${oauthState.projectId.toString()}/git?github=connected`,
    };
  }

  private async getWorkspaceId(projectId: string) {
    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new ApiError(StatusCode.NOT_FOUND, "Project not found.");
    }

    return project.workspaceId.toString();
  }

  async getRepositories(
    workspaceId: string,
    projectId: string,
    userId: string,
  ) {
    const project = await this.getProject(workspaceId, projectId);

    this.ensureOwner(project, userId);

    const integration = await projectGitRepository.findByProjectId(projectId);

    if (!integration) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "GitHub is not connected to this project.",
      );
    }

    return githubClient.getInstallationRepositories(integration.installationId);
  }

  async connectRepository(
    workspaceId: string,
    projectId: string,
    userId: string,
    data: ConnectRepositoryInput,
  ) {
    const project = await this.getProject(workspaceId, projectId);

    this.ensureOwner(project, userId);

    const parsed = connectRepositorySchema.safeParse(data);

    if (!parsed.success) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? "Invalid repository ID.",
      );
    }

    const integration = await projectGitRepository.findByProjectId(projectId);

    if (!integration) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "GitHub is not connected to this project.",
      );
    }

    const repositories = await githubClient.getInstallationRepositories(
      integration.installationId,
    );

    const repository = repositories.repositories.find(
      (item) => item.id === parsed.data.repositoryId,
    );

    if (!repository) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "Repository is not available through the connected GitHub installation.",
      );
    }

    const owner = repository.owner?.login ?? repository.full_name.split("/")[0];

    const updated = await projectGitRepository.updateRepository(projectId, {
      repositoryId: repository.id,
      repositoryName: repository.name,
      repositoryFullName: repository.full_name,
      repositoryOwner: owner,
      repositoryUrl: repository.html_url,
      defaultBranch: repository.default_branch,
    });

    return updated;
  }

  async disconnect(workspaceId: string, projectId: string, userId: string) {
    const project = await this.getProject(workspaceId, projectId);

    this.ensureOwner(project, userId);

    const integration = await projectGitRepository.findByProjectId(projectId);

    if (!integration) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "GitHub is not connected to this project.",
      );
    }

    await projectGitRepository.deleteByProjectId(projectId);

    return true;
  }

  private async getConnectedRepository(workspaceId: string, projectId: string) {
    const project = await this.getProject(workspaceId, projectId);

    const integration = await projectGitRepository.findByProjectId(projectId);

    if (
      !integration ||
      !integration.repositoryId ||
      !integration.repositoryOwner ||
      !integration.repositoryName
    ) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "No GitHub repository is connected to this project.",
      );
    }

    return {
      project,
      integration,
    };
  }

  async getBranches(workspaceId: string, projectId: string) {
    const { integration } = await this.getConnectedRepository(
      workspaceId,
      projectId,
    );

    return githubClient.getBranches(
      integration.installationId,
      integration.repositoryOwner!,
      integration.repositoryName!,
    );
  }

  async getCommits(workspaceId: string, projectId: string) {
    const { integration } = await this.getConnectedRepository(
      workspaceId,
      projectId,
    );

    return githubClient.getCommits(
      integration.installationId,
      integration.repositoryOwner!,
      integration.repositoryName!,
    );
  }

  async getPullRequests(workspaceId: string, projectId: string) {
    const { integration } = await this.getConnectedRepository(
      workspaceId,
      projectId,
    );

    return githubClient.getPullRequests(
      integration.installationId,
      integration.repositoryOwner!,
      integration.repositoryName!,
    );
  }
}

export const projectGitService = new ProjectGitService();
