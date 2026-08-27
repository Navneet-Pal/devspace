import { Types } from "mongoose";

import { File } from "./model.js";

import type { IFile } from "./types.js";

class FileRepository {
  async create(data: Partial<IFile>) {
    return File.create(data);
  }

  async findByProject(projectId: Types.ObjectId) {
    return File.find({
      projectId,
      deletedAt: null,
    })
      .sort({
        createdAt: -1,
      })
      .populate("uploadedBy", "_id name email avatar")
      .lean();
  }

  async findById(fileId: Types.ObjectId, projectId: Types.ObjectId) {
    return File.findOne({
      _id: fileId,
      projectId,
      deletedAt: null,
    })
      .populate("uploadedBy", "_id name email avatar")
      .lean();
  }

  async softDelete(fileId: Types.ObjectId, projectId: Types.ObjectId) {
    return File.findOneAndUpdate(
      {
        _id: fileId,
        projectId,
        deletedAt: null,
      },
      {
        $set: {
          deletedAt: new Date(),
        },
      },
      {
        new: true,
      },
    );
  }
}

export const fileRepository = new FileRepository();
