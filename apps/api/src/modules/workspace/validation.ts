import { z } from "zod"; 
import { WORKSPACE_DESCRIPTION, WORKSPACE_NAME } from "./constants.js";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      WORKSPACE_NAME.MIN_LENGTH,
      `Workspace name must be at least ${WORKSPACE_NAME.MIN_LENGTH} characters`
    )
    .max(
      WORKSPACE_NAME.MAX_LENGTH,
      `Workspace name cannot exceed ${WORKSPACE_NAME.MAX_LENGTH} characters`
    ),

  description: z
    .string()
    .trim()
    .max(
      WORKSPACE_DESCRIPTION.MAX_LENGTH,
      `Description cannot exceed ${WORKSPACE_DESCRIPTION.MAX_LENGTH} characters`
    )
    .optional(),
}).strict();

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(WORKSPACE_NAME.MIN_LENGTH)
    .max(WORKSPACE_NAME.MAX_LENGTH)
    .optional(),

  description: z
    .string()
    .trim()
    .max(WORKSPACE_DESCRIPTION.MAX_LENGTH)
    .optional(),
}).strict();

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>