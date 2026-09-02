import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 
import { projectGitService } from "@/services/projectGit/service";
 
import type { ConnectRepositoryRequest } from "@/services/projectGit/types";
import { projectGitKeys } from "@/services/projectGit/keys";

export const useProjectGit = (workspaceId: string, projectId: string) => {
  return useQuery({
    queryKey: projectGitKeys.integration(workspaceId, projectId),

    queryFn: () => projectGitService.getIntegration(workspaceId, projectId),

    enabled: Boolean(workspaceId && projectId),
  });
};

export const useGitHubRepositories = (
  workspaceId: string,
  projectId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: projectGitKeys.repositories(workspaceId, projectId),

    queryFn: () => projectGitService.getRepositories(workspaceId, projectId),

    enabled: Boolean(workspaceId && projectId && enabled),
  });
};

export const useGitBranches = (
  workspaceId: string,
  projectId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: projectGitKeys.branches(workspaceId, projectId),

    queryFn: () => projectGitService.getBranches(workspaceId, projectId),

    enabled: Boolean(workspaceId && projectId && enabled),
  });
};

export const useGitCommits = (
  workspaceId: string,
  projectId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: projectGitKeys.commits(workspaceId, projectId),

    queryFn: () => projectGitService.getCommits(workspaceId, projectId),

    enabled: Boolean(workspaceId && projectId && enabled),
  });
};

export const useGitPullRequests = (
  workspaceId: string,
  projectId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: projectGitKeys.pullRequests(workspaceId, projectId),

    queryFn: () => projectGitService.getPullRequests(workspaceId, projectId),

    enabled: Boolean(workspaceId && projectId && enabled),
  });
};

export const useInstallGitHub = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
    }: {
      workspaceId: string;
      projectId: string;
    }) => projectGitService.createGitHubInstallUrl(workspaceId, projectId),
  });
};

export const useConnectGitHubRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      data: ConnectRepositoryRequest;
    }) => projectGitService.connectRepository(workspaceId, projectId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectGitKeys.integration(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.removeQueries({
        queryKey: projectGitKeys.repositories(
          variables.workspaceId,
          variables.projectId,
        ),
      });
    },
  });
};

export const useDisconnectGitHub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
    }: {
      workspaceId: string;
      projectId: string;
    }) => projectGitService.disconnectGitHub(workspaceId, projectId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectGitKeys.integration(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.removeQueries({
        queryKey: projectGitKeys.repositories(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.removeQueries({
        queryKey: projectGitKeys.branches(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.removeQueries({
        queryKey: projectGitKeys.commits(
          variables.workspaceId,
          variables.projectId,
        ),
      });

      queryClient.removeQueries({
        queryKey: projectGitKeys.pullRequests(
          variables.workspaceId,
          variables.projectId,
        ),
      });
    },
  });
};
