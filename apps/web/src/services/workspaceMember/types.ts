import { ApiResponse } from "@/types/apiTypes";

export interface WorkspaceMemberUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface WorkspaceMember {
  _id: string;
  workspaceId: string;
  userId: WorkspaceMemberUser;
  role: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
  updatedAt: string;
}

export type GetWorkspaceMembersResponse =
  ApiResponse<WorkspaceMember[]>;

export interface UpdateMemberRoleRequest {
  role: "ADMIN" | "MEMBER";
}

export type UpdateMemberRoleResponse =
  ApiResponse<WorkspaceMember>;

export type RemoveMemberResponse =
  ApiResponse<null>;