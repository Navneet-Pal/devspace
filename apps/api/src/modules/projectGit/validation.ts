import { z } from "zod";

export const connectRepositorySchema = z.object({
  repositoryId: z.number().int().positive("Invalid repository ID."),
});

export type ConnectRepositoryInput = z.infer<typeof connectRepositorySchema>;
