import z from "zod";

import { PROJECT_ROLE } from "../../constants/projectRole.js";

export const addProjectMemberSchema = z.object({
  userId: z.string().trim().min(1, "User is required"),

  role: z.enum(Object.values(PROJECT_ROLE) as [string, ...string[]]),
});

export const updateProjectMemberRoleSchema = z.object({
  role: z.enum(Object.values(PROJECT_ROLE) as [string, ...string[]]),
});

export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;

export type UpdateProjectMemberRoleInput = z.infer<
  typeof updateProjectMemberRoleSchema
>;
