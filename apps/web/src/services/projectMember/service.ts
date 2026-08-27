import { axiosInstance } from "@/lib/axios";

import type {
  AddProjectMemberRequest,
  AddProjectMemberResponse,
  GetProjectMembersResponse,
  RemoveProjectMemberResponse,
  UpdateProjectMemberRoleRequest,
  UpdateProjectMemberRoleResponse,
} from "./types";

class ProjectMemberService {
  async getProjectMembers(
    workspaceId: string,
    projectId: string,
  ): Promise<GetProjectMembersResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/members`,
    );

    return response.data;
  }

  async addProjectMember(
    workspaceId: string,
    projectId: string,
    data: AddProjectMemberRequest,
  ): Promise<AddProjectMemberResponse> {
    const response = await axiosInstance.post(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/members`,
      data,
    );

    return response.data;
  }

  async updateProjectMemberRole(
    workspaceId: string,
    projectId: string,
    memberId: string,
    data: UpdateProjectMemberRoleRequest,
  ): Promise<UpdateProjectMemberRoleResponse> {
    const response = await axiosInstance.patch(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/members/${memberId}`,
      data,
    );

    return response.data;
  }

  async removeProjectMember(
    workspaceId: string,
    projectId: string,
    memberId: string,
  ): Promise<RemoveProjectMemberResponse> {
    const response = await axiosInstance.delete(
      `/v1/workspaces/${workspaceId}/projects/${projectId}/members/${memberId}`,
    );

    return response.data;
  }
}

export const projectMemberService = new ProjectMemberService();
