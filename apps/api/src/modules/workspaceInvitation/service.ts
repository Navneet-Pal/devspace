import mongoose from "mongoose";
import { ROLE, Role } from "../../constants/roles.js";
import { StatusCode } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { UserRespository } from "../user/respository.js";
import { workspaceRepository } from "../workspace/repository.js";
import { workspaceMemberRepository } from "../workspaceMember/repository.js";
import { workspaceInvitationRepository } from "./respository.js";
import { INVITATION_STATUS } from "./types.js";

const userRespository = new UserRespository();

class WorkspaceInvitationService {
  async inviteMember(
    workspaceId: string,
    userId: string,
    invitedBy: string,
    role: Role,
  ) {
    const workspace = await workspaceRepository.findById(workspaceId);

    if (!workspace)
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found");

    const user = await userRespository.findById(userId);

    if (!user) throw new ApiError(StatusCode.NOT_FOUND, "User not found.");

    if (userId === invitedBy)
      throw new ApiError(StatusCode.BAD_REQUEST, "You cannot invite yourself.");

    if (role === ROLE.OWNER)
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Owner role cannot be assigned.",
      );

    const member = await workspaceMemberRepository.findByUserAndWorkspace(
      workspaceId,
      userId,
    );

    if (member)
      throw new ApiError(StatusCode.CONFLICT, "User is already a member.");

    const invitation =
      await workspaceInvitationRepository.findByWorkspaceAndUser(
        workspaceId,
        userId,
      );

    if (invitation)
      throw new ApiError(StatusCode.CONFLICT, "Invitation already exists.");

    return workspaceInvitationRepository.create(
      workspace._id,
      user._id,
      new mongoose.Types.ObjectId(invitedBy),
      role,
    );
  }

  async acceptInvitation(invitationId: string) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const invitation =
        await workspaceInvitationRepository.findById(invitationId);

      if (!invitation)
        throw new ApiError(StatusCode.NOT_FOUND, "Invitation not found.");

      const member = await workspaceMemberRepository.findByUserAndWorkspace(
        invitation.workspaceId,
        invitation.userId,
      );

      if (member)
        throw new ApiError(StatusCode.CONFLICT, "User is already a member");

      await workspaceMemberRepository.create(
        invitation.workspaceId,
        invitation.userId,
        invitation.role,
        session,
      );

      await workspaceInvitationRepository.delete(invitationId, session);

      await session.commitTransaction();
      return true;

    } catch (error) {
      await session.abortTransaction();
      throw error;

    } finally {
      await session.endSession();
    }
  }

  async rejectInvitation(invitationId : string){
    const invitation = await workspaceInvitationRepository.findById(invitationId);

    if(!invitation) throw new ApiError(StatusCode.NOT_FOUND, "Invitation not found.");

    await workspaceInvitationRepository.delete(invitationId);
    return true;
  }

  async cancelInvitation(invitationId: string) {
    const invitation =
      await workspaceInvitationRepository.findById(invitationId);

    if (!invitation)
      throw new ApiError(StatusCode.NOT_FOUND, "Invitation not found.");

    await workspaceInvitationRepository.delete(invitationId);

    return true;
  }

  async getWorkspaceInvitations(workspaceId: string) {
    return workspaceInvitationRepository.findByWorkspaceId(workspaceId);
  }

  async getMyInvitations(userId: string) {
    return workspaceInvitationRepository.findByUserId(userId);
  }

}

export const workspaceInvitationService = new WorkspaceInvitationService();
