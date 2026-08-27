import { useMutation, useQuery } from "@tanstack/react-query";

import { projectMemberKeys } from "@/services/projectMember/keys";
import { projectMemberService } from "@/services/projectMember/service";

import type {
  AddProjectMemberRequest,
  UpdateProjectMemberRoleRequest,
} from "@/services/projectMember/types";

export const useProjectMembers = (workspaceId: string, projectId: string) => {
  return useQuery({
    queryKey: projectMemberKeys.list(workspaceId, projectId),

    queryFn: () =>
      projectMemberService.getProjectMembers(workspaceId, projectId),

    enabled: !!workspaceId && !!projectId,
  });
};

export const useAddProjectMember = () => {
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
  });
};

export const useUpdateProjectMemberRole = () => {
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
  });
};

export const useRemoveProjectMember = () => {
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
  });
};
