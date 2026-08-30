import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/services/dashboard/keys";
import { fileKeys } from "@/services/file/keys";
import { fileService } from "@/services/file/service";

const workspaceActivityKey = (workspaceId: string) => [
  "workspace-dashboard-activity",
  workspaceId,
];

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
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: fileKeys.projectList(
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

export const useDeleteProjectFile = () => {
  const queryClient = useQueryClient();

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: fileKeys.projectList(
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
