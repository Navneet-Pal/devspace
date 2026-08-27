import { Types } from "mongoose";

import { Comment } from "./model.js";
import type {
  CreateCommentInput,
  IComment,
  UpdateCommentInput,
} from "./types.js";

class CommentRepository {
  async create(
    workspaceId: Types.ObjectId,
    projectId: Types.ObjectId,
    taskId: Types.ObjectId | null,
    authorId: Types.ObjectId,
    data: CreateCommentInput,
  ): Promise<IComment> {
    return Comment.create({
      workspaceId,
      projectId,
      taskId,
      authorId,
      content: data.content,
      mentions: data.mentions ?? [],
    });
  }

  async findById(
    commentId: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<IComment | null> {
    return Comment.findOne({
      _id: commentId,
      projectId,
      deletedAt: null,
    });
  }

  async findByProject(projectId: Types.ObjectId): Promise<IComment[]> {
    return Comment.find({
      projectId,
      taskId: null,
      deletedAt: null,
    })
      .sort({
        createdAt: -1,
      })
      .populate("authorId", "_id name email avatar");
  }

  async findByTask(
    projectId: Types.ObjectId,
    taskId: Types.ObjectId,
  ): Promise<IComment[]> {
    return Comment.find({
      projectId,
      taskId,
      deletedAt: null,
    })
      .sort({
        createdAt: -1,
      })
      .populate("authorId", "_id name email avatar");
  }

  async updateById(
    commentId: Types.ObjectId,
    projectId: Types.ObjectId,
    data: UpdateCommentInput,
  ): Promise<IComment | null> {
    return Comment.findOneAndUpdate(
      {
        _id: commentId,
        projectId,
        deletedAt: null,
      },
      {
        $set: {
          content: data.content,
          mentions: data.mentions ?? [],
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("authorId", "_id name email avatar");
  }

  async softDelete(
    commentId: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<IComment | null> {
    return Comment.findOneAndUpdate(
      {
        _id: commentId,
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

export const commentRepository = new CommentRepository();
