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
    const baseSlug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let counter = 2;

    while (await workspaceRepository.existsBySlug(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    return slug;
  }

  async createWorkspace(data: CreateWorkspaceDTO, ownerId: Types.ObjectId) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const slug = await this.generateUniqueSlug(data.name);

      const workspace = await workspaceRepository.create(
        {
          ...data,
          slug,
          ownerId,
        },
        session,
      );

      await workspaceMemberRepository.create(
        workspace._id as Types.ObjectId,
        ownerId,
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

    if (!workspace) {
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");
    }

    return workspace;
  }

  async getWorkspaceBySlug(slug: string) {
    const workspace = await workspaceRepository.findBySlug(slug);

    if (!workspace) {
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");
    }

    return workspace;
  }

  async getMyWorkspaces(userId: Types.ObjectId) {
    return workspaceRepository.findByUserId(userId);
  }

  async updateWorkspace(workspaceId: string, data: UpdateWorkspaceDTO) {
    const workspace = await workspaceRepository.update(workspaceId, data);

    if (!workspace) {
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");
    }

    return workspace;
  }

  async deleteWorkspace(workspaceId: string) {
    const workspace = await workspaceRepository.softDelete(workspaceId);

    if (!workspace) {
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");
    }

    return workspace;
  }

  async hardDeleteWorkspace(workspaceId: string) {
    const workspace = await workspaceRepository.hardDelete(workspaceId);

    if (!workspace) {
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");
    }

    return workspace;
  }

  async updateLogo(workspaceId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Workspace logo is required.");
    }

    const workspace = await workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");
    }

    /*
     * Upload the new image first.
     *
     * This prevents us from deleting the old
     * image before the new upload succeeds.
     */
    const uploaded = await uploadImage(file, "devspace/workspaces");

    /*
     * Update workspace with the new avatar.
     */
    const updatedWorkspace = await workspaceRepository.updateLogo(workspaceId, {
      publicId: uploaded.public_id,
      url: uploaded.secure_url,
    });

    /*
     * If DB update failed, clean up the newly
     * uploaded image so Cloudinary does not
     * accumulate orphaned files.
     */
    if (!updatedWorkspace) {
      await deleteImage(uploaded.public_id);

      throw new ApiError(StatusCode.NOT_FOUND, "Workspace not found.");
    }

    /*
     * Delete the old image only after the
     * database has successfully stored the new one.
     */
    if (workspace.avatar?.publicId) {
      try {
        await deleteImage(workspace.avatar.publicId);
      } catch {
        /*
         * Old image cleanup failure should not
         * make an otherwise successful workspace
         * update look like it failed.
         */
      }
    }

    return updatedWorkspace;
  }
}

export const workspaceService = new WorkspaceService();
