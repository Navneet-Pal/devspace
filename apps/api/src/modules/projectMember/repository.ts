import { Types } from "mongoose";

import { ProjectMember } from "./model.js";
import { CreateProjectMemberDTO, UpdateProjectMemberRoleDTO } from "./types.js";

class ProjectMemberRepository {
  async create(data: CreateProjectMemberDTO) {
    return ProjectMember.create(data);
  }

  async findById(memberId: string | Types.ObjectId) {
    return ProjectMember.findById(memberId);
  }

  async findByProjectId(projectId: string | Types.ObjectId) {
    return ProjectMember.find({ projectId })
      .populate("userId", "name email avatar")
      .sort({ createdAt: 1 });
  }

  async findByProjectAndUser(
    projectId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ) {
    return ProjectMember.findOne({
      projectId,
      userId,
    });
  }

  async findByUserId(userId: string | Types.ObjectId) {
    return ProjectMember.find({ userId }).sort({ createdAt: -1 });
  }

  async updateRole(
    memberId: string | Types.ObjectId,
    data: UpdateProjectMemberRoleDTO,
  ) {
    return ProjectMember.findByIdAndUpdate(memberId, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(memberId: string | Types.ObjectId) {
    return ProjectMember.findByIdAndDelete(memberId);
  }

  async exists(
    projectId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ) {
    return ProjectMember.exists({
      projectId,
      userId,
    });
  }
}

export const projectMemberRepository = new ProjectMemberRepository();
