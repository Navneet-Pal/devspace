import { ClientSession, Types } from "mongoose";
import { Role } from "../../constants/roles.js";
import { workspaceInvitation } from "./model.js";
import { INVITATION_STATUS, InvitationStatus } from "./types.js";

class WorkspaceInvitationRepository {
  async create(
    workspaceId: Types.ObjectId,
    userId: Types.ObjectId,
    invitedBy: Types.ObjectId,
    role: Role,
    session?: ClientSession,
  ) {
    return workspaceInvitation
      .create([{ workspaceId, userId, invitedBy, role }], { session })
      .then((result) => result[0]);
  }

  async findById(invitationId: string | Types.ObjectId) {
    return workspaceInvitation.findById(invitationId);
  }

  async findByWorkspaceId(workspaceId: string | Types.ObjectId) {
    return workspaceInvitation.find({ workspaceId }).populate("userId","name email avatar").sort({ createdAt: -1 });
  }

  async findPendingInvitation(
    workspaceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ) {
    return workspaceInvitation.findOne({
      workspaceId,
      userId,
      status: INVITATION_STATUS.PENDING,
    });
  }

  async findByUserId(userId: string | Types.ObjectId) {
    return workspaceInvitation.find({ userId }).sort({ createdAt: -1 });
  }

  async delete(invitationId: string | Types.ObjectId, session?: ClientSession) {
    return workspaceInvitation.findByIdAndDelete(invitationId, { session });
  }

  async exists(
    workspaceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ) {
    return workspaceInvitation.exists({ workspaceId, userId });
  }

  async findByWorkspaceAndUser(
    workspaceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ) {
    return workspaceInvitation.findOne({ workspaceId, userId });
  }
}

export const workspaceInvitationRepository =
  new WorkspaceInvitationRepository();
