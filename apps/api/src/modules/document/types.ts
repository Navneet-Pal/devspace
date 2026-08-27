import { Types } from "mongoose";

export interface IDocument {
  _id: Types.ObjectId;

  workspaceId: Types.ObjectId;

  projectId: Types.ObjectId;

  title: string;

  content: string;

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  deletedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateDocumentInput {
  title: string;
  content?: string;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
}
