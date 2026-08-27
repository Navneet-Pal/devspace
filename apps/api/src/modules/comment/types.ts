import { Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;

  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;

  taskId: Types.ObjectId | null;

  authorId: Types.ObjectId;

  content: string;

  mentions: Types.ObjectId[];

  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentInput {
  content: string;
  mentions?: string[];
}

export interface UpdateCommentInput {
  content: string;
  mentions?: string[];
}
