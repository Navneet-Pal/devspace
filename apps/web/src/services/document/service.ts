import { axiosInstance } from "@/lib/axios";

import type {
  CreateDocumentRequest,
  CreateDocumentResponse,
  DeleteDocumentResponse,
  GetDocumentResponse,
  GetDocumentsResponse,
  UpdateDocumentRequest,
  UpdateDocumentResponse,
} from "./types";

class DocumentService {
  async getDocuments(
    workspaceId: string,
    projectId: string,
  ): Promise<GetDocumentsResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/documents`,
    );

    return response.data;
  }

  async getDocument(
    workspaceId: string,
    projectId: string,
    documentId: string,
  ): Promise<GetDocumentResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/documents/${documentId}`,
    );

    return response.data;
  }

  async createDocument(
    workspaceId: string,
    projectId: string,
    data: CreateDocumentRequest,
  ): Promise<CreateDocumentResponse> {
    const response = await axiosInstance.post(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/documents`,
      data,
    );

    return response.data;
  }

  async updateDocument(
    workspaceId: string,
    projectId: string,
    documentId: string,
    data: UpdateDocumentRequest,
  ): Promise<UpdateDocumentResponse> {
    const response = await axiosInstance.patch(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/documents/${documentId}`,
      data,
    );

    return response.data;
  }

  async deleteDocument(
    workspaceId: string,
    projectId: string,
    documentId: string,
  ): Promise<DeleteDocumentResponse> {
    const response = await axiosInstance.delete(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/documents/${documentId}`,
    );

    return response.data;
  }
}

export const documentService = new DocumentService();
