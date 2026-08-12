import { axiosInstance } from "@/lib/axios";

import {
  GetWorkspaceMembersResponse,
  UpdateMemberRoleRequest,
  UpdateMemberRoleResponse,
  RemoveMemberResponse,
} from "./types";

class WorkspaceMemberService {
  async getWorkspaceMembers(
    workspaceId: string,
  ): Promise<GetWorkspaceMembersResponse> {
    const response = await axiosInstance.get(
      `/v1/workspace/${workspaceId}/members`,
    );

    return response.data;
  }

  async updateMemberRole(
    workspaceId: string,
    memberId: string,
    data: UpdateMemberRoleRequest,
  ): Promise<UpdateMemberRoleResponse> {
    const response = await axiosInstance.patch(
      `/v1/workspace/${workspaceId}/members/${memberId}`,
      data,
    );

    return response.data;
  }

  async removeMember(
    workspaceId: string,
    memberId: string,
  ): Promise<RemoveMemberResponse> {
    const response = await axiosInstance.delete(
      `/v1/workspace/${workspaceId}/members/${memberId}`,
    );

    return response.data;
  }
}

export const workspaceMemberService = new WorkspaceMemberService();
