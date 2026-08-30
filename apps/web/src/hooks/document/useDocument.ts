import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/services/dashboard/keys";
import { documentKeys } from "@/services/document/keys";
import { documentService } from "@/services/document/service";

import type {
  CreateDocumentRequest,
  UpdateDocumentRequest,
} from "@/services/document/types";

const workspaceActivityKey = (workspaceId: string) => [
  "workspace-dashboard-activity",
  workspaceId,
];

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
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.projectList(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.projectList(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(
          variables.workspaceId,
          variables.projectId,
          variables.documentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.projectList(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.removeQueries({
        queryKey: documentKeys.detail(
          variables.workspaceId,
          variables.projectId,
          variables.documentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};
