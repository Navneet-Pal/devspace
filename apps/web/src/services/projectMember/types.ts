import type { ApiResponse } from "@/types/apiTypes";

export type ProjectRole = "PROJECT_ADMIN" | "PROJECT_MEMBER" | "PROJECT_VIEWER";

export interface ProjectMemberUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ProjectMember {
  _id: string;
  projectId: string;
  userId: ProjectMemberUser;
  role: ProjectRole;
  createdAt: string;
  updatedAt: string;
}

export interface AddProjectMemberRequest {
  userId: string;
  role: ProjectRole;
}

export interface UpdateProjectMemberRoleRequest {
  role: ProjectRole;
}

export type GetProjectMembersResponse = ApiResponse<ProjectMember[]>;

export type AddProjectMemberResponse = ApiResponse<ProjectMember>;

export type UpdateProjectMemberRoleResponse = ApiResponse<ProjectMember>;

export type RemoveProjectMemberResponse = ApiResponse<null>;
