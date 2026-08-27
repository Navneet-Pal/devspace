import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Document title is required.")
    .max(200, "Document title cannot exceed 200 characters."),

  content: z.string().optional().default(""),
});

export const updateDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Document title is required.")
    .max(200, "Document title cannot exceed 200 characters.")
    .optional(),

  content: z.string().optional(),
});
