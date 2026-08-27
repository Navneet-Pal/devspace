import { Document, Types } from "mongoose";

import { ProjectRole } from "../../constants/projectRole.js";

export interface IProjectMember extends Document {
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  role: ProjectRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectMemberDTO {
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  role: ProjectRole;
}

export interface UpdateProjectMemberRoleDTO {
  role: ProjectRole;
}
