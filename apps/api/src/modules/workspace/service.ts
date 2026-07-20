import { Types } from "mongoose";
import { ROLE } from "../../constants/roles.js";
import { StatusCode } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { workspaceMemberRepository } from "../workspaceMember/repository.js";
import { WorkspaceResponseDTO } from "./dto/responseWorkspace.js";
import { WorkspaceMapper } from "./mapper.js";
import { workspaceRepository } from "./repository.js";
import { CreateWorkspaceInput } from "./validation.js";
import mongoose from "mongoose";

class WorkspaceService {
  async createWorkspace(
    userId: Types.ObjectId,
    data: CreateWorkspaceInput,
  ): Promise<WorkspaceResponseDTO> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const workspace = await workspaceRepository.create(
        {
          ...data,
          ownerId: userId.toString(),
        },
        session,
      );

      await workspaceMemberRepository.create(
        workspace._id,
        userId,
        ROLE.OWNER,
        session,
      );

      await session.commitTransaction();

      return WorkspaceMapper.toResponse(workspace);
    } catch (error) {
      await session.abortTransaction();

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to create workspace.",
      );
    } finally {
      await session.endSession();
    }
  }
}

export const workspaceService = new WorkspaceService();
