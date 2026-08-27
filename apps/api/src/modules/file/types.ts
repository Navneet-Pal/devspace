import { Types } from "mongoose";

export type FileResourceType = "image" | "raw" | "video";

export interface IFile {
  _id: Types.ObjectId;

  workspaceId: Types.ObjectId;

  projectId: Types.ObjectId;

  uploadedBy: Types.ObjectId;

  originalName: string;

  publicId: string;

  secureUrl: string;

  resourceType: FileResourceType;

  mimeType: string;

  size: number;

  deletedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
