import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/services/dashboard/keys";
import { projectMemberKeys } from "@/services/projectMember/keys";
import { projectMemberService } from "@/services/projectMember/service";

import type {
  AddProjectMemberRequest,
  UpdateProjectMemberRoleRequest,
} from "@/services/projectMember/types";

const workspaceActivityKey = (workspaceId: string) => [
  "workspace-dashboard-activity",
  workspaceId,
];

export const useProjectMembers = (workspaceId: string, projectId: string) => {
  return useQuery({
    queryKey: projectMemberKeys.list(workspaceId, projectId),

    queryFn: () =>
      projectMemberService.getProjectMembers(workspaceId, projectId),

    enabled: !!workspaceId && !!projectId,
  });
};

export const useAddProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      data: AddProjectMemberRequest;
    }) => projectMemberService.addProjectMember(workspaceId, projectId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectMemberKeys.list(
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

export const useUpdateProjectMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      memberId,
      data,
    }: {
      workspaceId: string;
      projectId: string;
      memberId: string;
      data: UpdateProjectMemberRoleRequest;
    }) =>
      projectMemberService.updateProjectMemberRole(
        workspaceId,
        projectId,
        memberId,
        data,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectMemberKeys.list(
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

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      memberId,
    }: {
      workspaceId: string;
      projectId: string;
      memberId: string;
    }) =>
      projectMemberService.removeProjectMember(
        workspaceId,
        projectId,
        memberId,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectMemberKeys.list(
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
