import mongoose, { Types } from "mongoose";
import slugify from "slugify";
import { workspaceRepository } from "./repository.js";
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from "./types.js";
import { workspaceMemberRepository } from "../workspaceMember/repository.js";
import { ROLE } from "../../constants/roles.js";
import { StatusCode } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { deleteImage, uploadImage } from "../../utils/upload.js";

class WorkspaceService {
  private async generateUniqueSlug(name: string) {
    const baseSlug = slugify(name, { lower: true, strict: true, trim: true });

    let slug = baseSlug;
    let counter = 2;

    while (await workspaceRepository.existsBySlug(slug))
      slug = `${baseSlug}-${counter++}`;

    return slug;
  }

  async createWorkspace(data: CreateWorkspaceDTO, ownerId: Types.ObjectId) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const slug = await this.generateUniqueSlug(data.name);
      const ownerObjectId = ownerId;

      const workspace = await workspaceRepository.create(
        {
          ...data,
          slug,
          ownerId: ownerObjectId,
        },
        session,
      );

      await workspaceMemberRepository.create(
        workspace._id as Types.ObjectId,
        ownerObjectId,
        ROLE.OWNER,
        session,
      );

      await session.commitTransaction();

      return workspace;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getWorkspaceById(workspaceId: string) {
    const workspace = await workspaceRepository.findById(workspaceId);

    if (!workspace)
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");

    return workspace;
  }

  async getWorkspaceBySlug(slug: string) {
    const workspace = await workspaceRepository.findBySlug(slug);

    if (!workspace)
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");

    return workspace;
  }

  async getMyWorkspaces(ownerId: Types.ObjectId) {
    return workspaceRepository.findByOwnerId(ownerId);
  }

  async updateWorkspace(workspaceId: string, data: UpdateWorkspaceDTO) {
    const workspace = await workspaceRepository.update(workspaceId, data);

    if (!workspace)
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");

    return workspace;
  }

  async deleteWorkspace(workspaceId: string) {
    const workspace = await workspaceRepository.softDelete(workspaceId);

    if (!workspace)
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");

    return workspace;
  }

  async hardDeleteWorkspace(workspaceId: string) {
    const workspace = await workspaceRepository.hardDelete(workspaceId);

    if (!workspace)
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");

    return workspace;
  }

  async updateLogo(workspaceId: string, file?: Express.Multer.File) {
    if (!file)
      throw new ApiError(StatusCode.BAD_REQUEST, "Workspace logo is required.");

    const workspace = await workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");
    }

    if(workspace.logo?.publicId){
      await deleteImage(workspace.logo.publicId);
    }

    const uploaded = await uploadImage(file,"devspace/workspaces");

    return workspaceRepository.updateLogo(workspaceId,{publicId : uploaded.public_id , url: uploaded.secure_url});
  }
}

export const workspaceService = new WorkspaceService();
