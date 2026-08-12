import { ApiResponse } from "@/types/apiTypes";

export type InvitationRole = "OWNER" | "ADMIN" | "MEMBER";

export type InvitationStatus = "PENDING" | "REJECTED" | "CANCELLED";

export interface WorkspaceInvitation {
  _id: string;
  workspaceId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  invitedBy: string;
  role: InvitationRole;
  status: InvitationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceInvitationRequest {
  userId: string;
  role: Exclude<InvitationRole, "OWNER">;
}

export type GetWorkspaceInvitationsResponse = ApiResponse<
  WorkspaceInvitation[]
>;

export type GetMyInvitationsResponse = ApiResponse<WorkspaceInvitation[]>;

export type CreateWorkspaceInvitationResponse =
  ApiResponse<WorkspaceInvitation>;

export type AcceptInvitationResponse = ApiResponse<null>;

export type RejectInvitationResponse = ApiResponse<null>;

export type CancelInvitationResponse = ApiResponse<null>;
