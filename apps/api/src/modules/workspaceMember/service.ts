import { Types } from "mongoose";
import { ROLE, Role } from "../../constants/roles.js";
import { StatusCode } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { workspaceMemberRepository } from "./repository.js";

class WorkspaceMemberService {
  async getWorkspaceMember(workspaceId: string) {
    return workspaceMemberRepository.findByWorkspaceId(workspaceId);
  }

  async updateMemberRole(workspaceId: string, memberId: string, role: Role) {
    const member = await workspaceMemberRepository.findById(memberId);

    if (!member) throw new ApiError(StatusCode.NOT_FOUND, "Member not found.");

    if (member.workspaceId.toString() !== workspaceId)
      throw new ApiError(StatusCode.BAD_REQUEST, "Invalid workspace member.");

    if (member.role === ROLE.OWNER)
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Owner role cannot be updated.",
      );

    if (member.role === role)
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Member already has this role.",
      );

    return workspaceMemberRepository.updateRole(
      workspaceId,
      member.userId as Types.ObjectId,
      role,
    );
  }

  async removeMember(workspaceId: string, memberId: string) {
    const member = await workspaceMemberRepository.findById(memberId);

    if (!member) throw new ApiError(StatusCode.NOT_FOUND, "Member not found.");

    if (member.workspaceId.toString() !== workspaceId)
      throw new ApiError(StatusCode.BAD_REQUEST, "Invalid workspace member.");

    if (member.role === ROLE.OWNER)
      throw new ApiError(StatusCode.BAD_REQUEST, "Owner cannot be removed.");

    await workspaceMemberRepository.delete(
      workspaceId,
      member.userId as Types.ObjectId,
    );

    return true;
  }
}

export const workspaceMemberService = new WorkspaceMemberService();
