import { useMutation, useQuery } from "@tanstack/react-query";

import { fileKeys } from "@/services/file/keys";
import { fileService } from "@/services/file/service";

export const useProjectFiles = (workspaceId: string, projectId: string) => {
  return useQuery({
    queryKey: fileKeys.projectList(workspaceId, projectId),

    queryFn: () => fileService.getProjectFiles(workspaceId, projectId),

    enabled: !!workspaceId && !!projectId,
  });
};

export const useProjectFile = (
  workspaceId: string,
  projectId: string,
  fileId: string,
) => {
  return useQuery({
    queryKey: fileKeys.detail(workspaceId, projectId, fileId),

    queryFn: () => fileService.getProjectFile(workspaceId, projectId, fileId),

    enabled: !!workspaceId && !!projectId && !!fileId,
  });
};

export const useUploadProjectFile = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      file,
    }: {
      workspaceId: string;
      projectId: string;
      file: File;
    }) => fileService.uploadProjectFile(workspaceId, projectId, file),
  });
};

export const useDeleteProjectFile = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      fileId,
    }: {
      workspaceId: string;
      projectId: string;
      fileId: string;
    }) => fileService.deleteProjectFile(workspaceId, projectId, fileId),
  });
};
