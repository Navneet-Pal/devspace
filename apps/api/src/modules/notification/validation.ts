import { z } from "zod";

export const notificationQuerySchema = z.object({
  isRead: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const notificationIdSchema = z.object({
  notificationId: z.string().min(1, "Notification ID is required."),
});
