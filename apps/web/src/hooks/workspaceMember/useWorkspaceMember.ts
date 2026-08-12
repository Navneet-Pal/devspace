import { useMutation, useQuery } from "@tanstack/react-query";

import { workspaceMemberKeys } from "@/services/workspaceMember/keys";
import { workspaceMemberService } from "@/services/workspaceMember/service";

import type { UpdateMemberRoleRequest } from "@/services/workspaceMember/types";

export const useWorkspaceMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceMemberKeys.list(workspaceId),
    queryFn: () => workspaceMemberService.getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useUpdateMemberRole = () => {
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
  });
};

export const useRemoveMember = () => {
  return useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
    }: {
      workspaceId: string;
      memberId: string;
    }) => workspaceMemberService.removeMember(workspaceId, memberId),
  });
};
