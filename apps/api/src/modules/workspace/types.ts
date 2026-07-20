import { Document, Types } from "mongoose";

export interface IWorkspace extends Document{
    name : string;
    description?: string;
    logo?: string;
    ownerId:Types.ObjectId;
    createdAt:Date;
    updatedAt : Date;
}

export interface CreateWorkspaceDTO {
  name: string;
  description?: string;
  logo?: string;
  ownerId: string;
}

export interface UpdateWorkspaceDTO {
  name?: string;
  description?: string;
  logo?: string;
}
 