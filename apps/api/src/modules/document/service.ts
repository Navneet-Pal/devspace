import { Types } from "mongoose";

import { StatusCode } from "../../constants/statusCode.js";
import { PROJECT_ROLE, ProjectRole } from "../../constants/projectRole.js";
import { ApiError } from "../../utils/ApiError.js";

import { projectRepository } from "../project/repository.js";
import { activityService } from "../activity/service.js";
import { ACTIVITY_TYPE } from "../activity/types.js";

import { documentRepository } from "./repository.js";

import type { CreateDocumentInput, UpdateDocumentInput } from "./types.js";

class DocumentService {
  async createDocument(
    workspaceId: string,
    projectId: string,
    userId: string,
    projectRole: ProjectRole,
    data: CreateDocumentInput,
  ) {
    this.checkPermission(projectRole, "create");

    await this.validateProject(workspaceId, projectId);

    const document = await documentRepository.create(
      new Types.ObjectId(workspaceId),
      new Types.ObjectId(projectId),
      new Types.ObjectId(userId),
      data,
    );

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.DOCUMENT_CREATED,
      {
        documentId: document._id.toString(),
        documentTitle: document.title,
      },
    );

    return document;
  }

  async getDocuments(workspaceId: string, projectId: string) {
    await this.validateProject(workspaceId, projectId);

    return documentRepository.findByProject(new Types.ObjectId(projectId));
  }

  async getDocument(
    workspaceId: string,
    projectId: string,
    documentId: string,
  ) {
    await this.validateProject(workspaceId, projectId);

    const document = await documentRepository.findById(
      new Types.ObjectId(documentId),
      new Types.ObjectId(projectId),
    );

    if (!document) {
      throw new ApiError(StatusCode.NOT_FOUND, "Document not found.");
    }

    return document;
  }

  async updateDocument(
    workspaceId: string,
    projectId: string,
    documentId: string,
    userId: string,
    projectRole: ProjectRole,
    data: UpdateDocumentInput,
  ) {
    this.checkPermission(projectRole, "update");

    const document = await this.getDocument(workspaceId, projectId, documentId);

    const updatedDocument = await documentRepository.updateById(
      new Types.ObjectId(documentId),
      new Types.ObjectId(projectId),
      new Types.ObjectId(userId),
      data,
    );

    if (!updatedDocument) {
      throw new ApiError(StatusCode.NOT_FOUND, "Document not found.");
    }

    const titleChanged =
      data.title !== undefined && data.title !== document.title;

    const contentChanged =
      data.content !== undefined && data.content !== document.content;

    if (titleChanged || contentChanged) {
      await activityService.record(
        workspaceId,
        projectId,
        userId,
        ACTIVITY_TYPE.DOCUMENT_UPDATED,
        {
          documentId,
          documentTitle: document.title,
          changes: {
            ...(titleChanged && {
              title: {
                from: document.title,
                to: data.title,
              },
            }),

            ...(contentChanged && {
              content: true,
            }),
          },
        },
      );
    }

    return updatedDocument;
  }

  async deleteDocument(
    workspaceId: string,
    projectId: string,
    documentId: string,
    userId: string,
    projectRole: ProjectRole,
  ) {
    this.checkPermission(projectRole, "delete");

    const document = await this.getDocument(workspaceId, projectId, documentId);

    const deletedDocument = await documentRepository.softDelete(
      new Types.ObjectId(documentId),
      new Types.ObjectId(projectId),
    );

    if (!deletedDocument) {
      throw new ApiError(StatusCode.NOT_FOUND, "Document not found.");
    }

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.DOCUMENT_DELETED,
      {
        documentId,
        documentTitle: document.title,
      },
    );

    return deletedDocument;
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

  private checkPermission(
    projectRole: ProjectRole,
    action: "create" | "update" | "delete",
  ) {
    if (projectRole === PROJECT_ROLE.ADMIN) {
      return;
    }

    if (projectRole === PROJECT_ROLE.VIEWER) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "Project viewers cannot modify documents.",
      );
    }

    if (action === "delete") {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "Project members cannot delete documents.",
      );
    }
  }
}

export const documentService = new DocumentService();
