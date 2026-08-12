import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, "Workspace name must be at least 3 characters.")
    .max(50, "Workspace name cannot exceed 50 characters."),

  description: z
    .string()
    .max(300, "Description cannot exceed 300 characters.")
    .optional(),

    logo: z.instanceof(File).optional().refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Logo must be smaller than 5 MB.",
    )
    .refine(
      (file) =>
        !file ||
        ["image/png", "image/jpeg", "image/webp"].includes(file.type),
      "Logo must be PNG, JPG or WEBP.",
    ),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;
