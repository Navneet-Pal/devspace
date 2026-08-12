import { ClientSession, Types } from "mongoose";
import { Workspace } from "./model.js";
import { CreateWorkspaceData, IWorkspaceLogo, UpdateWorkspaceDTO } from "./types.js";

class WorkspaceRepository {
  async create(data: CreateWorkspaceData, session?: ClientSession) {
    return Workspace.create([data], { session }).then((result) => result[0]);
  }

  async findById(workspaceId: string | Types.ObjectId) {
    return Workspace.findOne({
      _id: workspaceId,
      deletedAt: null,
    });
  }

  async findBySlug(slug: string) {
    return Workspace.findOne({
      slug,
      deletedAt: null,
    });
  }

  async existsBySlug(slug: string) {
    return Workspace.exists({
      slug,
      deletedAt: null,
    });
  }

  async findByOwnerId(ownerId: string | Types.ObjectId) {
    return Workspace.find({
      ownerId,
      deletedAt: null,
    }).sort({
      createdAt: -1,
    });
  }

  async update(
    workspaceId: string | Types.ObjectId,
    data: UpdateWorkspaceDTO,
    session?: ClientSession,
  ) {
    return Workspace.findOneAndUpdate(
      {
        _id: workspaceId,
        deletedAt: null,
      },
      data,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
  }

  async softDelete(
    workspaceId: string | Types.ObjectId,
    session?: ClientSession,
  ) {
    return Workspace.findOneAndUpdate(
      {
        _id: workspaceId,
        deletedAt: null,
      },
      {
        deletedAt: new Date(),
      },
      {
        new: true,
        session,
      },
    );
  }

  async hardDelete(workspaceId: string | Types.ObjectId) {
    return Workspace.findByIdAndDelete(workspaceId);
  }

  async updateLogo(workspaceId : string | Types.ObjectId , logo : IWorkspaceLogo, session? : ClientSession){
    return Workspace.findByIdAndUpdate({ _id : workspaceId , deleteAt : null }, {logo}, {new : true , runValidators : true , session})
  }



}

export const workspaceRepository = new WorkspaceRepository();
