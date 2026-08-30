import { Types } from "mongoose";

import { StatusCode } from "../../constants/statusCode.js";
import { ProjectRole } from "../../constants/projectRole.js";
import { ApiError } from "../../utils/ApiError.js";

import { workspaceMemberRepository } from "../workspaceMember/repository.js";
import { projectRepository } from "../project/repository.js";
import { activityService } from "../activity/service.js";
import { ACTIVITY_TYPE } from "../activity/types.js"; 

import { projectMemberRepository } from "./repository.js"; 
import { userRepository } from "../user/respository.js";

class ProjectMemberService {
  async getProjectMembers(workspaceId: string, projectId: string) {
    await this.validateProject(workspaceId, projectId);

    return projectMemberRepository.findByProjectId(projectId);
  }

  async addProjectMember(
    workspaceId: string,
    projectId: string,
    userId: string,
    role: ProjectRole,
    currentUserId: string,
  ) {
    await this.validateProject(workspaceId, projectId);

    // User must already belong to the workspace.
    const workspaceMember =
      await workspaceMemberRepository.findByUserAndWorkspace(
        workspaceId,
        userId,
      );

    if (!workspaceMember) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "User is not a member of this workspace.",
      );
    }

    // Workspace owner does not need
    // separate project membership.
    if (workspaceMember.role === "OWNER") {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Workspace owner cannot be added as a project member.",
      );
    }

    // Prevent duplicate membership.
    const existingMember = await projectMemberRepository.findByProjectAndUser(
      projectId,
      userId,
    );

    if (existingMember) {
      throw new ApiError(
        StatusCode.CONFLICT,
        "User is already a member of this project.",
      );
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(StatusCode.NOT_FOUND, "User not found.");
    }

    const member = await projectMemberRepository.create({
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(userId),
      role,
    });

    await activityService.record(
      workspaceId,
      projectId,
      currentUserId,
      ACTIVITY_TYPE.MEMBER_ADDED,
      {
        memberId: member._id.toString(),
        userId,
        memberName: user.name,
        role,
      },
    );

    return member;
  }

  async updateMemberRole(
    workspaceId: string,
    projectId: string,
    memberId: string,
    role: ProjectRole,
    currentUserId: string,
  ) {
    await this.validateProject(workspaceId, projectId);

    const member = await projectMemberRepository.findById(memberId);

    if (!member) {
      throw new ApiError(StatusCode.NOT_FOUND, "Project member not found.");
    }

    if (member.projectId.toString() !== projectId) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Invalid project member.");
    }

    if (member.userId.toString() === currentUserId) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "You cannot change your own project role.",
      );
    }

    if (member.role === role) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Member already has this role.",
      );
    }

    const user = await userRepository.findById(member.userId.toString());

    if (!user) {
      throw new ApiError(StatusCode.NOT_FOUND, "User not found.");
    }

    const previousRole = member.role;

    const updatedMember = await projectMemberRepository.updateRole(memberId, {
      role,
    });

    await activityService.record(
      workspaceId,
      projectId,
      currentUserId,
      ACTIVITY_TYPE.MEMBER_ROLE_CHANGED,
      {
        memberId,
        userId: member.userId.toString(),
        memberName: user.name,
        from: previousRole,
        to: role,
      },
    );

    return updatedMember;
  }

  async removeProjectMember(
    workspaceId: string,
    projectId: string,
    memberId: string,
    currentUserId: string,
  ) {
    await this.validateProject(workspaceId, projectId);

    const member = await projectMemberRepository.findById(memberId);

    if (!member) {
      throw new ApiError(StatusCode.NOT_FOUND, "Project member not found.");
    }

    if (member.userId.toString() === currentUserId) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "You cannot remove yourself from the project.",
      );
    }

    if (member.projectId.toString() !== projectId) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Invalid project member.");
    }

    const user = await userRepository.findById(member.userId.toString());

    if (!user) {
      throw new ApiError(StatusCode.NOT_FOUND, "User not found.");
    }

    await projectMemberRepository.delete(memberId);

    await activityService.record(
      workspaceId,
      projectId,
      currentUserId,
      ACTIVITY_TYPE.MEMBER_REMOVED,
      {
        memberId,
        userId: member.userId.toString(),
        memberName: user.name,
        role: member.role,
      },
    );

    return true;
  }

  async validateProject(workspaceId: string, projectId: string) {
    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new ApiError(StatusCode.NOT_FOUND, "Project not found.");
    }

    if (project.workspaceId.toString() !== workspaceId) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Project does not belong to this workspace.",
      );
    }

    return project;
  }
}

export const projectMemberService = new ProjectMemberService();
