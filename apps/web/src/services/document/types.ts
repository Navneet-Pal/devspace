import type { ApiResponse } from "@/types/apiTypes";

export interface DocumentUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Document {
  _id: string;
  workspaceId: string;
  projectId: string;

  title: string;
  content: string;

  createdBy: DocumentUser;
  updatedBy: DocumentUser;

  deletedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentRequest {
  title: string;
  content?: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
}

export type GetDocumentsResponse = ApiResponse<Document[]>;

export type GetDocumentResponse = ApiResponse<Document>;

export type CreateDocumentResponse = ApiResponse<Document>;

export type UpdateDocumentResponse = ApiResponse<Document>;

export type DeleteDocumentResponse = ApiResponse<null>;
