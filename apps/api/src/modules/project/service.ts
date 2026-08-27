import { Types } from "mongoose";

import { StatusCode } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";

import { workspaceRepository } from "../workspace/repository.js";
import { projectRepository } from "./repository.js";
import { projectMemberRepository } from "../projectMember/repository.js";
import { activityService } from "../activity/service.js";
import { ACTIVITY_TYPE } from "../activity/types.js";

import { PROJECT_ROLE } from "../../constants/projectRole.js";

import type { UpdateProjectDTO } from "./types.js";

class ProjectService {
  async createProject(
    workspaceId: string,
    userId: string,
    data: {
      name: string;
      description?: string;
    },
  ) {
    const workspace = await workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");
    }

    const existingProject = await projectRepository.findByWorkspaceAndName(
      workspaceId,
      data.name,
    );

    if (existingProject) {
      throw new ApiError(
        StatusCode.CONFLICT,
        "A project with this name already exists in this workspace.",
      );
    }

    const project = await projectRepository.create({
      workspaceId: new Types.ObjectId(workspaceId),
      name: data.name,
      description: data.description,
      createdBy: new Types.ObjectId(userId),
    });

    await projectMemberRepository.create({
      projectId: project._id,
      userId: new Types.ObjectId(userId),
      role: PROJECT_ROLE.ADMIN,
    });

    await activityService.record(
      workspaceId,
      project._id.toString(),
      userId,
      ACTIVITY_TYPE.PROJECT_CREATED,
      {
        projectId: project._id.toString(),
        name: project.name,
      },
    );

    return project;
  }

  async getWorkspaceProjects(workspaceId: string) {
    const workspace = await workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");
    }

    return projectRepository.findByWorkspaceId(workspaceId);
  }

  async getProject(workspaceId: string, projectId: string) {
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

  async updateProject(
    workspaceId: string,
    projectId: string,
    userId: string,
    data: UpdateProjectDTO,
  ) {
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

    if (data.name) {
      const existingProject = await projectRepository.findByWorkspaceAndName(
        workspaceId,
        data.name,
      );

      if (existingProject && existingProject._id.toString() !== projectId) {
        throw new ApiError(
          StatusCode.CONFLICT,
          "A project with this name already exists in this workspace.",
        );
      }
    }

    const nameChanged = data.name !== undefined && data.name !== project.name;

    const descriptionChanged =
      data.description !== undefined &&
      data.description !== (project.description ?? "");

    const statusChanged =
      data.status !== undefined && data.status !== project.status;

    const updatedProject = await projectRepository.update(projectId, data);

    if (nameChanged || descriptionChanged || statusChanged) {
      await activityService.record(
        workspaceId,
        projectId,
        userId,
        ACTIVITY_TYPE.PROJECT_UPDATED,
        {
          projectId,
          changes: {
            ...(nameChanged && {
              name: {
                from: project.name,
                to: data.name,
              },
            }),

            ...(descriptionChanged && {
              description: {
                from: project.description ?? null,
                to: data.description ?? null,
              },
            }),

            ...(statusChanged && {
              status: {
                from: project.status,
                to: data.status,
              },
            }),
          },
        },
      );
    }

    return updatedProject;
  }

  async deleteProject(workspaceId: string, projectId: string) {
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

    await projectRepository.delete(projectId);

    return true;
  }
}

export const projectService = new ProjectService();
