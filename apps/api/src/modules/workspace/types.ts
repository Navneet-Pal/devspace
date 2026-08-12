import { Document, Types } from "mongoose";

export interface IWorkspaceLogo {
  publicId: string;
  url: string;
}

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: IWorkspaceLogo;

  ownerId: Types.ObjectId;

  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkspaceDTO {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceDTO {
  name?: string;
  description?: string;
}

export interface CreateWorkspaceData {
  name: string;
  slug: string;
  description?: string;
  logo?: IWorkspaceLogo;
  ownerId: Types.ObjectId;
}
 