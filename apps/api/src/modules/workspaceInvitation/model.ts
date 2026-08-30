import mongoose, { Schema } from "mongoose";

import { ROLES } from "../../constants/roles.js";

import {
  INVITATION_STATUS,
  INVITATION_STATUSES,
  IWorkspaceInvitation,
} from "./types.js";

const workspaceInvitationSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ROLES,
      required: true,
    },

    status: {
      type: String,
      enum: INVITATION_STATUSES,
      default: INVITATION_STATUS.PENDING,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
 * IMPORTANT:
 *
 * This index must NOT be unique.
 *
 * A user can receive multiple invitations
 * to the same workspace over time.
 */
workspaceInvitationSchema.index({
  workspaceId: 1,
  userId: 1,
});

workspaceInvitationSchema.index({
  userId: 1,
});

workspaceInvitationSchema.index({
  workspaceId: 1,
});

export const workspaceInvitation = mongoose.model<IWorkspaceInvitation>(
  "WorkspaceInvitation",
  workspaceInvitationSchema,
);
