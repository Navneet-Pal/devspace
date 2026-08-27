import { z } from "zod";

export const uploadFileSchema = z.object({});

export const fileIdSchema = z.object({
  fileId: z.string().min(1, "File ID is required."),
});
