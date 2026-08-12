import { useMutation, useQuery } from "@tanstack/react-query";

import { workspaceInvitationKeys } from "@/services/workspaceInvitation/keys";

import { CreateWorkspaceInvitationRequest } from "@/services/workspaceInvitation/types";

import { workspaceInvitationService } from "@/services/workspaceInvitation/service";

export const useWorkspaceInvitations = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceInvitationKeys.list(workspaceId),

    queryFn: () =>
      workspaceInvitationService.getWorkspaceInvitations(workspaceId),

    enabled: !!workspaceId,
  });
};

export const useMyInvitations = () => {
  return useQuery({
    queryKey: workspaceInvitationKeys.my(),

    queryFn: () => workspaceInvitationService.getMyInvitations(),
  });
};

export const useCreateInvitation = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateWorkspaceInvitationRequest;
    }) => workspaceInvitationService.createInvitation(workspaceId, data),
  });
};

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: (invitationId: string) =>
      workspaceInvitationService.acceptInvitation(invitationId),
  });
};

export const useRejectInvitation = () => {
  return useMutation({
    mutationFn: (invitationId: string) =>
      workspaceInvitationService.rejectInvitation(invitationId),
  });
};

export const useCancelInvitation = () => {
  return useMutation({
    mutationFn: (invitationId: string) =>
      workspaceInvitationService.cancelInvitation(invitationId),
  });
};
