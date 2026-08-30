import { Document, Types } from "mongoose";

import { WORKSPACE_DESCRIPTION, WORKSPACE_NAME } from "./constants.js";

export interface IWorkspaceAvatar {
  publicId?: string | null;
  url?: string | null;
}

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  description?: string;

  avatar?: IWorkspaceAvatar;

  ownerId: Types.ObjectId;

  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkspaceDTO {
  name: string;
  description?: string;
}

export interface CreateWorkspaceData {
  name: string;
  slug: string;
  description?: string;
  ownerId: Types.ObjectId;
}

export interface UpdateWorkspaceDTO {
  name?: string;
  description?: string;
}

export interface IWorkspaceLogo {
  publicId: string;
  url: string;
}
