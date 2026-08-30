import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/services/dashboard/keys";
import { projectKeys } from "@/services/project/keys";
import { projectService } from "@/services/project/service";

import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/services/project/types";

const workspaceActivityKey = (workspaceId: string) => [
  "workspace-dashboard-activity",
  workspaceId,
];

export const useProjects = (workspaceId: string) => {
  return useQuery({
    queryKey: projectKeys.list(workspaceId),

    queryFn: () => projectService.getWorkspaceProjects(workspaceId),

    enabled: !!workspaceId,
  });
};

export const useProject = (workspaceId: string, projectId: string) => {
  return useQuery({
    queryKey: projectKeys.detail(workspaceId, projectId),

    queryFn: () => projectService.getProject(workspaceId, projectId),

    enabled: !!workspaceId && !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateProjectRequest;
    }) => projectService.createProject(workspaceId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(variables.workspaceId),
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

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      data: UpdateProjectRequest;
    }) => projectService.updateProject(workspaceId, projectId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(
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

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
    }: {
      workspaceId: string;
      projectId: string;
    }) => projectService.deleteProject(workspaceId, projectId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(variables.workspaceId),
      });

      queryClient.removeQueries({
        queryKey: projectKeys.detail(
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
