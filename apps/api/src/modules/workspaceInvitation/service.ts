import mongoose from "mongoose";

import { ROLE, Role } from "../../constants/roles.js";

import { StatusCode } from "../../constants/statusCode.js";

import { ApiError } from "../../utils/ApiError.js";

import { UserRepository } from "../user/respository.js";

import { workspaceRepository } from "../workspace/repository.js";

import { workspaceMemberRepository } from "../workspaceMember/repository.js";

import { workspaceInvitationRepository } from "./respository.js";

import { INVITATION_STATUS } from "./types.js";

const userRepository = new UserRepository();

class WorkspaceInvitationService {
  async inviteMember(
    workspaceId: string,
    userId: string,
    invitedBy: string,
    role: Role,
  ) {
    const workspace = await workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found");
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(StatusCode.NOT_FOUND, "User not found.");
    }

    if (userId === invitedBy) {
      throw new ApiError(StatusCode.BAD_REQUEST, "You cannot invite yourself.");
    }

    if (role === ROLE.OWNER) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Owner role cannot be assigned.",
      );
    }

    const member = await workspaceMemberRepository.findByUserAndWorkspace(
      workspaceId,
      userId,
    );

    /*
     * If the user already joined the workspace,
     * they cannot be invited again.
     */
    if (member) {
      throw new ApiError(StatusCode.CONFLICT, "User is already a member.");
    }

    /*
     * Only a PENDING invitation blocks
     * sending another invitation.
     *
     * REJECTED / CANCELLED invitations
     * remain in history and do NOT block
     * a new invitation.
     */
    const pendingInvitation =
      await workspaceInvitationRepository.findPendingInvitation(
        workspaceId,
        userId,
      );

    if (pendingInvitation) {
      throw new ApiError(StatusCode.CONFLICT, "Invitation already exists.");
    }

    /*
     * Always create a NEW invitation.
     *
     * This preserves complete invitation
     * history permanently.
     */
    return workspaceInvitationRepository.create(
      workspace._id,
      user._id,
      new mongoose.Types.ObjectId(invitedBy),
      role,
    );
  }

  async acceptInvitation(invitationId: string, userId: string) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const invitation =
        await workspaceInvitationRepository.findById(invitationId);

      if (!invitation) {
        throw new ApiError(StatusCode.NOT_FOUND, "Invitation not found.");
      }

      if (invitation.userId.toString() !== userId) {
        throw new ApiError(
          StatusCode.FORBIDDEN,
          "You are not authorized to accept this invitation.",
        );
      }

      if (invitation.status !== INVITATION_STATUS.PENDING) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Only pending invitations can be accepted.",
        );
      }

      const member = await workspaceMemberRepository.findByUserAndWorkspace(
        invitation.workspaceId,
        invitation.userId,
      );

      if (member) {
        throw new ApiError(StatusCode.CONFLICT, "User is already a member.");
      }

      await workspaceMemberRepository.create(
        invitation.workspaceId,
        invitation.userId,
        invitation.role,
        session,
      );

      /*
       * Keep the invitation record.
       * Only change its status.
       */
      const updatedInvitation =
        await workspaceInvitationRepository.updateStatus(
          invitationId,
          INVITATION_STATUS.ACCEPTED,
          session,
        );

      await session.commitTransaction();

      return updatedInvitation;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async rejectInvitation(invitationId: string, userId: string) {
    const invitation =
      await workspaceInvitationRepository.findById(invitationId);

    if (!invitation) {
      throw new ApiError(StatusCode.NOT_FOUND, "Invitation not found.");
    }

    if (invitation.userId.toString() !== userId) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "You are not authorized to reject this invitation.",
      );
    }

    if (invitation.status !== INVITATION_STATUS.PENDING) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Only pending invitations can be rejected.",
      );
    }

    return workspaceInvitationRepository.updateStatus(
      invitationId,
      INVITATION_STATUS.REJECTED,
    );
  }

  async cancelInvitation(invitationId: string, invitedBy: string) {
    const invitation =
      await workspaceInvitationRepository.findById(invitationId);

    if (!invitation) {
      throw new ApiError(StatusCode.NOT_FOUND, "Invitation not found.");
    }

    if (invitation.invitedBy.toString() !== invitedBy) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "You are not authorized to cancel this invitation.",
      );
    }

    if (invitation.status !== INVITATION_STATUS.PENDING) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Only pending invitations can be cancelled.",
      );
    }

    return workspaceInvitationRepository.updateStatus(
      invitationId,
      INVITATION_STATUS.CANCELLED,
    );
  }

  async getWorkspaceInvitations(workspaceId: string) {
    return workspaceInvitationRepository.findByWorkspaceId(workspaceId);
  }

  async getMyInvitations(userId: string) {
    return workspaceInvitationRepository.findByUserId(userId);
  }
}

export const workspaceInvitationService = new WorkspaceInvitationService();
