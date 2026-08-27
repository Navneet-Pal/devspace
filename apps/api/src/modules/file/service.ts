import { Types } from "mongoose";

import { StatusCode } from "../../constants/statusCode.js";
import { PROJECT_ROLE, ProjectRole } from "../../constants/projectRole.js";
import { ApiError } from "../../utils/ApiError.js";

import { projectRepository } from "../project/repository.js";
import { activityService } from "../activity/service.js";
import { ACTIVITY_TYPE } from "../activity/types.js";

import {
  deleteFile,
  uploadFile, 
} from "../../utils/upload.js";

import { fileRepository } from "./repository.js";

class FileService {
  async uploadProjectFile(
    workspaceId: string,
    projectId: string,
    userId: string,
    projectRole: ProjectRole,
    file: Express.Multer.File | undefined,
  ) {
    this.checkUploadPermission(projectRole);

    await this.validateProject(workspaceId, projectId);

    if (!file) {
      throw new ApiError(StatusCode.BAD_REQUEST, "File is required.");
    }

    const folder = `devspace/projects/${projectId}`;

    const cloudinaryFile = await uploadFile(file, folder);

    const savedFile = await fileRepository.create({
      workspaceId: new Types.ObjectId(workspaceId),

      projectId: new Types.ObjectId(projectId),

      uploadedBy: new Types.ObjectId(userId),

      originalName: file.originalname,

      publicId: cloudinaryFile.public_id,

      secureUrl: cloudinaryFile.secure_url,

      resourceType: cloudinaryFile.resource_type as "image" | "raw" | "video",

      mimeType: file.mimetype,

      size: file.size,

      deletedAt: null,
    });

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.FILE_UPLOADED,
      {
        fileId: savedFile._id.toString(),

        fileName: savedFile.originalName,
      },
    );

    return savedFile;
  }

  async getProjectFiles(workspaceId: string, projectId: string) {
    await this.validateProject(workspaceId, projectId);

    return fileRepository.findByProject(new Types.ObjectId(projectId));
  }

  async getProjectFile(workspaceId: string, projectId: string, fileId: string) {
    await this.validateProject(workspaceId, projectId);

    const file = await fileRepository.findById(
      new Types.ObjectId(fileId),
      new Types.ObjectId(projectId),
    );

    if (!file) {
      throw new ApiError(StatusCode.NOT_FOUND, "File not found.");
    }

    return file;
  }

  async deleteProjectFile(
    workspaceId: string,
    projectId: string,
    fileId: string,
    userId: string,
    projectRole: ProjectRole,
  ) {
    this.checkDeletePermission(projectRole);

    await this.validateProject(workspaceId, projectId);

    const file = await fileRepository.findById(
      new Types.ObjectId(fileId),
      new Types.ObjectId(projectId),
    );

    if (!file) {
      throw new ApiError(StatusCode.NOT_FOUND, "File not found.");
    }

    await deleteFile(file.publicId, file.resourceType);

    const deletedFile = await fileRepository.softDelete(
      new Types.ObjectId(fileId),
      new Types.ObjectId(projectId),
    );

    if (!deletedFile) {
      throw new ApiError(StatusCode.NOT_FOUND, "File not found.");
    }

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.FILE_DELETED,
      {
        fileId,
        fileName: file.originalName,
      },
    );

    return deletedFile;
  }

  private async validateProject(workspaceId: string, projectId: string) {
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

  private checkUploadPermission(projectRole: ProjectRole) {
    if (projectRole === PROJECT_ROLE.VIEWER) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "Project viewers cannot upload files.",
      );
    }
  }

  private checkDeletePermission(projectRole: ProjectRole) {
    if (projectRole !== PROJECT_ROLE.ADMIN) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "Only project admins can delete files.",
      );
    }
  }
}

export const fileService = new FileService();
