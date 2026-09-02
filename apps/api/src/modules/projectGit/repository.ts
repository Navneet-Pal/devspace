import { Types } from "mongoose";

import { ProjectGitIntegration } from "./model.js";
import { ProjectGitOAuthState } from "./oauthStateModel.js";

export const projectGitRepository = {
  async findByProjectId(projectId: string | Types.ObjectId) {
    return ProjectGitIntegration.findOne({
      projectId,
    }).populate("connectedBy", "_id name email avatar");
  },

  async create(data: {
    projectId: Types.ObjectId;
    provider: "github";
    installationId: number;
    connectedBy: Types.ObjectId;
  }) {
    return ProjectGitIntegration.create(data);
  },

  async updateRepository(
    projectId: string | Types.ObjectId,
    data: {
      repositoryId: number;
      repositoryName: string;
      repositoryFullName: string;
      repositoryOwner: string;
      repositoryUrl: string;
      defaultBranch: string | null;
    },
  ) {
    return ProjectGitIntegration.findOneAndUpdate(
      { projectId },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("connectedBy", "_id name email avatar");
  },

  async deleteByProjectId(projectId: string | Types.ObjectId) {
    return ProjectGitIntegration.findOneAndDelete({
      projectId,
    });
  },

  async createOAuthState(data: {
    state: string;
    projectId: Types.ObjectId;
    userId: Types.ObjectId;
    expiresAt: Date;
  }) {
    return ProjectGitOAuthState.create(data);
  },

  async findOAuthState(state: string) {
    return ProjectGitOAuthState.findOne({
      state,
    });
  },

  async deleteOAuthState(state: string) {
    return ProjectGitOAuthState.deleteOne({
      state,
    });
  },
};
