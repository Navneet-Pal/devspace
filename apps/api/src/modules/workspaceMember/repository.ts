import { ClientSession, Types } from "mongoose";
import { WorkspaceMember } from "./model.js";
import { Role } from "../../constants/roles.js";

class WorkspaceMemberRepository {
  async create(workspaceId: Types.ObjectId, userId: Types.ObjectId, role: Role, session?: ClientSession) {
    return WorkspaceMember.create([{ workspaceId, userId, role }], { session }).then(result => result[0]);
  }

  async findByUserAndWorkspace(workspaceId: string | Types.ObjectId, userId: string | Types.ObjectId) {
    return WorkspaceMember.findOne({ workspaceId, userId });
  }

  async findById(memberId: string | Types.ObjectId) {
    return WorkspaceMember.findById(memberId);
  }
  
  async findByWorkspaceId(workspaceId: string | Types.ObjectId) {
    return WorkspaceMember.find({ workspaceId }).populate("userId","name email avatar").sort({createdAt : 1});
  }

  async findByUserId(userId: string | Types.ObjectId) {
    return WorkspaceMember.find({ userId });
  }

  async updateRole(workspaceId: string | Types.ObjectId, userId: string | Types.ObjectId, role: Role, session?: ClientSession) {
    return WorkspaceMember.findOneAndUpdate({ workspaceId, userId }, { role }, { new: true, runValidators: true, session });
  }

  async delete(workspaceId: string | Types.ObjectId, userId: string | Types.ObjectId, session?: ClientSession) {
    return WorkspaceMember.findOneAndDelete({ workspaceId, userId }, { session });
  }

  async exists(workspaceId: string | Types.ObjectId, userId: string | Types.ObjectId) {
    return WorkspaceMember.exists({ workspaceId, userId });
  }
}

export const workspaceMemberRepository = new WorkspaceMemberRepository();