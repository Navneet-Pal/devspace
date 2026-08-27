import { Types } from "mongoose";

import type {
  CreateDocumentInput,
  IDocument,
  UpdateDocumentInput,
} from "./types.js";
import { Document } from "./model.js";

class DocumentRepository {
  async create(
    workspaceId: Types.ObjectId,
    projectId: Types.ObjectId,
    userId: Types.ObjectId,
    data: CreateDocumentInput,
  ): Promise<IDocument> {
    return Document.create({
      workspaceId,
      projectId,
      title: data.title,
      content: data.content ?? "",
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async findByProject(projectId: Types.ObjectId): Promise<IDocument[]> {
    return Document.find({
      projectId,
      deletedAt: null,
    })
      .sort({
        updatedAt: -1,
      })
      .populate("createdBy", "_id name email avatar")
      .populate("updatedBy", "_id name email avatar");
  }

  async findById(
    documentId: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<IDocument | null> {
    return Document.findOne({
      _id: documentId,
      projectId,
      deletedAt: null,
    })
      .populate("createdBy", "_id name email avatar")
      .populate("updatedBy", "_id name email avatar");
  }

  async updateById(
    documentId: Types.ObjectId,
    projectId: Types.ObjectId,
    userId: Types.ObjectId,
    data: UpdateDocumentInput,
  ): Promise<IDocument | null> {
    return Document.findOneAndUpdate(
      {
        _id: documentId,
        projectId,
        deletedAt: null,
      },
      {
        $set: {
          ...(data.title !== undefined && {
            title: data.title,
          }),

          ...(data.content !== undefined && {
            content: data.content,
          }),

          updatedBy: userId,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("createdBy", "_id name email avatar")
      .populate("updatedBy", "_id name email avatar");
  }

  async softDelete(
    documentId: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<IDocument | null> {
    return Document.findOneAndUpdate(
      {
        _id: documentId,
        projectId,
        deletedAt: null,
      },
      {
        $set: {
          deletedAt: new Date(),
        },
      },
      {
        new: true,
      },
    );
  }
}

export const documentRepository = new DocumentRepository();
