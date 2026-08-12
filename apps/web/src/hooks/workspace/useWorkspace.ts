import { useMutation, useQuery } from "@tanstack/react-query";
 
import { workspaceKeys } from "@/services/workspace/keys";

import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from "@/services/workspace/types";
import { workspaceService } from "@/services/workspace/service";

export const useMyWorkspaces = () => {
  return useQuery({
    queryKey: workspaceKeys.list(),
    queryFn: () => workspaceService.getMyWorkspaces(),
  });
};

export const useWorkspace = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: () => workspaceService.getWorkspace(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) =>
      workspaceService.createWorkspace(data),
  });
};

export const useUpdateWorkspace = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: UpdateWorkspaceRequest;
    }) => workspaceService.updateWorkspace(workspaceId, data),
  });
};

export const useDeleteWorkspace = () => {
  return useMutation({
    mutationFn: (workspaceId: string) =>
      workspaceService.deleteWorkspace(workspaceId),
  });
};

export const useUpdateWorkspaceLogo = () => {
  return useMutation({
    mutationFn: ({ workspaceId, logo }: { workspaceId: string; logo: File }) =>
      workspaceService.updateWorkspaceLogo(workspaceId, logo),
  });
};
