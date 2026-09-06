import { Types } from "mongoose";

import { StatusCode } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";

import { emitNotification } from "../../socket/notification.js";

import { workspaceRepository } from "../workspace/repository.js";
import { workspaceMemberRepository } from "../workspaceMember/repository.js";
import { projectRepository } from "./repository.js";
import { projectMemberRepository } from "../projectMember/repository.js";
import { activityService } from "../activity/service.js";
import { ACTIVITY_TYPE } from "../activity/types.js";
import { notificationService } from "../notification/service.js";
import { NotificationType } from "../notification/types.js";

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
        projectName: project.name,
      },
    );

    const workspaceMembers =
      await workspaceMemberRepository.findByWorkspaceId(workspaceId);

    for (const member of workspaceMembers) {
      const memberUserId = member.userId as unknown as {
        _id?: Types.ObjectId;
      };

      const recipientId = memberUserId._id
        ? memberUserId._id.toString()
        : member.userId.toString();

      if (recipientId === userId) {
        continue;
      }

      this.sendNotification(
        recipientId,
        workspaceId,
        project._id.toString(),
        NotificationType.PROJECT_CREATED,
        "New project created",
        `"${project.name}" was created in your workspace.`,
        `/dashboard/workspaces/${workspaceId}/projects/${project._id.toString()}`,
      );
    }

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
          projectName: project.name,
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

      const workspaceMembers =
        await workspaceMemberRepository.findByWorkspaceId(workspaceId);

      for (const member of workspaceMembers) {
        const memberUserId = member.userId as unknown as {
          _id?: Types.ObjectId;
        };

        const recipientId = memberUserId._id
          ? memberUserId._id.toString()
          : member.userId.toString();

        if (recipientId === userId) {
          continue;
        }

        this.sendNotification(
          recipientId,
          workspaceId,
          projectId,
          NotificationType.PROJECT_UPDATED,
          "Project updated",
          `"${project.name}" was updated.`,
          `/dashboard/workspaces/${workspaceId}/projects/${projectId}`,
        );
      }
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

  private sendNotification(
    userId: string,
    workspaceId: string,
    projectId: string,
    type: NotificationType,
    title: string,
    message: string,
    href: string,
  ) {
    void notificationService
      .createNotification({
        userId: new Types.ObjectId(userId),
        workspaceId: new Types.ObjectId(workspaceId),
        projectId: new Types.ObjectId(projectId),
        type,
        title,
        message,
        metadata: {
          href,
        },
      })
      .then((notification) => {
        emitNotification(userId, notification);
      })
      .catch(() => undefined);
  }
}

export const projectService = new ProjectService();
