import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys } from "@/services/dashboard/keys";
import { workspaceKeys } from "@/services/workspace/keys";
import { workspaceInvitationKeys } from "@/services/workspaceInvitation/keys";
import { CreateWorkspaceInvitationRequest } from "@/services/workspaceInvitation/types";
import { workspaceInvitationService } from "@/services/workspaceInvitation/service";

const workspaceActivityKey = (workspaceId: string) => [
  "workspace-dashboard-activity",
  workspaceId,
];

export const useWorkspaceInvitations = (
  workspaceId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: workspaceInvitationKeys.list(workspaceId),

    queryFn: () =>
      workspaceInvitationService.getWorkspaceInvitations(workspaceId),

    enabled: !!workspaceId && enabled,
  });
};

export const useMyInvitations = () => {
  return useQuery({
    queryKey: workspaceInvitationKeys.my(),

    queryFn: () => workspaceInvitationService.getMyInvitations(),
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateWorkspaceInvitationRequest;
    }) => workspaceInvitationService.createInvitation(workspaceId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceInvitationKeys.list(variables.workspaceId),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceActivityKey(variables.workspaceId),
      });
    },
  });
};

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      workspaceInvitationService.acceptInvitation(invitationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceInvitationKeys.my(),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });

      queryClient.invalidateQueries({
        queryKey: ["workspace-dashboard-activity"],
      });
    },
  });
};

export const useRejectInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      workspaceInvitationService.rejectInvitation(invitationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceInvitationKeys.my(),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      workspaceInvitationService.cancelInvitation(invitationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceInvitationKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.overview(),
      });
    },
  });
};
