import { Document, Types } from "mongoose";
import { Role } from "../../constants/roles.js";

export interface IWorkspaceMember extends Document {
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  role: Role;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkspaceMemberDTO {
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  role: Role;
}

export interface UpdateWorkspaceMemberDTO {
  role: Role;
}