import z from "zod";


export const createWorkspaceSchema = z.object({
    name : z.string().trim().min(3,"Workspace name must be atleast 3 characters.")
    .max(100,"Workspace name cannot exceed 100 character."),

    description : z.string().trim().max(500,"Description cannot exceed 500 characters.").optional(),

    logo: z.string().url("Logo must be a valid URL").optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;