import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/services/dashboard/keys";
import { workspaceMemberKeys } from "@/services/workspaceMember/keys";
import { workspaceMemberService } from "@/services/workspaceMember/service";

import type { UpdateMemberRoleRequest } from "@/services/workspaceMember/types";

const workspaceActivityKey = (workspaceId: string) => [
  "workspace-dashboard-activity",
  workspaceId,
];

export const useWorkspaceMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceMemberKeys.list(workspaceId),

    queryFn: () => workspaceMemberService.getWorkspaceMembers(workspaceId),

    enabled: !!workspaceId,
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
      data,
    }: {
      workspaceId: string;
      memberId: string;
      data: UpdateMemberRoleRequest;
    }) => workspaceMemberService.updateMemberRole(workspaceId, memberId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceMemberKeys.list(variables.workspaceId),
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

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
    }: {
      workspaceId: string;
      memberId: string;
    }) => workspaceMemberService.removeMember(workspaceId, memberId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceMemberKeys.list(variables.workspaceId),
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
