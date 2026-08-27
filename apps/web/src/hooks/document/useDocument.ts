import { useMutation, useQuery } from "@tanstack/react-query";

import { documentKeys } from "@/services/document/keys";
import { documentService } from "@/services/document/service";

import type {
  CreateDocumentRequest,
  UpdateDocumentRequest,
} from "@/services/document/types";

export const useDocuments = (workspaceId: string, projectId: string) => {
  return useQuery({
    queryKey: documentKeys.projectList(workspaceId, projectId),

    queryFn: () => documentService.getDocuments(workspaceId, projectId),

    enabled: !!workspaceId && !!projectId,
  });
};

export const useDocument = (
  workspaceId: string,
  projectId: string,
  documentId: string,
) => {
  return useQuery({
    queryKey: documentKeys.detail(workspaceId, projectId, documentId),

    queryFn: () =>
      documentService.getDocument(workspaceId, projectId, documentId),

    enabled: !!workspaceId && !!projectId && !!documentId,
  });
};

export const useCreateDocument = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      data: CreateDocumentRequest;
    }) => documentService.createDocument(workspaceId, projectId, data),
  });
};

export const useUpdateDocument = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      documentId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      documentId: string;
      data: UpdateDocumentRequest;
    }) =>
      documentService.updateDocument(workspaceId, projectId, documentId, data),
  });
};

export const useDeleteDocument = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      documentId,
    }: {
      workspaceId: string;
      projectId: string;
      documentId: string;
    }) => documentService.deleteDocument(workspaceId, projectId, documentId),
  });
};
