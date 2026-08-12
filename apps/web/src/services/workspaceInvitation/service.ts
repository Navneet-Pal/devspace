import { axiosInstance } from "@/lib/axios";

import {
  AcceptInvitationResponse,
  CancelInvitationResponse,
  CreateWorkspaceInvitationRequest,
  CreateWorkspaceInvitationResponse,
  GetMyInvitationsResponse,
  GetWorkspaceInvitationsResponse,
  RejectInvitationResponse,
} from "./types";

class WorkspaceInvitationService {
  async createInvitation(
    workspaceId: string,
    data: CreateWorkspaceInvitationRequest,
  ): Promise<CreateWorkspaceInvitationResponse> {
    const response = await axiosInstance.post(
      `/v1/workspaces/${workspaceId}/invitations`,
      data,
    );

    return response.data;
  }

  async getWorkspaceInvitations(
    workspaceId: string,
  ): Promise<GetWorkspaceInvitationsResponse> {
    const response = await axiosInstance.get(
      `/v1/workspaces/${workspaceId}/invitations`,
    );

    return response.data;
  }

  async getMyInvitations(): Promise<GetMyInvitationsResponse> {
    const response = await axiosInstance.get("/v1/invitations/me");

    return response.data;
  }

  async acceptInvitation(
    invitationId: string,
  ): Promise<AcceptInvitationResponse> {
    const response = await axiosInstance.patch(
      `/v1/invitations/${invitationId}/accept`,
    );

    return response.data;
  }

  async rejectInvitation(
    invitationId: string,
  ): Promise<RejectInvitationResponse> {
    const response = await axiosInstance.delete(
      `/v1/invitations/${invitationId}/reject`,
    );

    return response.data;
  }

  async cancelInvitation(
    invitationId: string,
  ): Promise<CancelInvitationResponse> {
    const response = await axiosInstance.delete(
      `/v1/invitations/${invitationId}/cancel`,
    );

    return response.data;
  }
}

export const workspaceInvitationService = new WorkspaceInvitationService();
