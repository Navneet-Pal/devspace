import z from "zod";

import { ROLES } from "../../constants/roles.js";

import { INVITATION_STATUS } from "./types.js";

export const createWorkspaceInvitationSchema = z.object({
  userId: z.string().trim().min(1, "User is required"),

  role: z.enum(ROLES as [string, ...string[]]),
});

export const updateWorkspaceInvitationSchema = z.object({
  status: z.enum([INVITATION_STATUS.REJECTED, INVITATION_STATUS.CANCELLED]),
});

export type CreateWorkspaceInvitationDTO = z.infer<
  typeof createWorkspaceInvitationSchema
>;

export type UpdateWorkspaceInvitationDTO = z.infer<
  typeof updateWorkspaceInvitationSchema
>;
