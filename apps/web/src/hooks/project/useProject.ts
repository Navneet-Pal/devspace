import { useMutation, useQuery } from "@tanstack/react-query";

import { projectKeys } from "@/services/project/keys";
import { projectService } from "@/services/project/service";

import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/services/project/types";

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
  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateProjectRequest;
    }) => projectService.createProject(workspaceId, data),
  });
};

export const useUpdateProject = () => {
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
  });
};

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
    }: {
      workspaceId: string;
      projectId: string;
    }) => projectService.deleteProject(workspaceId, projectId),
  });
};
