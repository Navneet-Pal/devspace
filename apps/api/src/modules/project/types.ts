import { Document, Types } from "mongoose";

export const PROJECT_STATUS = {
    ACTIVE : "Active",
    ARCHIVED : "Archived"
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export interface IProject extends Document{
    workspaceId : Types.ObjectId;
    name : string;
    description? : string;
    status : ProjectStatus;
    createdBy : Types.ObjectId;
    createdAt : Date;
    updatedAt : Date;
}

export interface CreateProjectDTO {
  workspaceId: Types.ObjectId;
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}