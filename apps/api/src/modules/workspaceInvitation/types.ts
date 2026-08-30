import { Document, Types } from "mongoose";

import { Role } from "../../constants/roles.js";

export const INVITATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export type InvitationStatus =
  (typeof INVITATION_STATUS)[keyof typeof INVITATION_STATUS];

export const INVITATION_STATUSES = Object.values(INVITATION_STATUS);

export interface IWorkspaceInvitation extends Document {
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  invitedBy: Types.ObjectId;
  role: Role;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkspaceInvitationDTO {
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  invitedBy: Types.ObjectId;
  role: Role;
}
