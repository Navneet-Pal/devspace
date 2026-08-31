import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID.");

const messageContentSchema = z
  .string()
  .trim()
  .min(1, "Message content is required.")
  .max(5000, "Message cannot exceed 5000 characters.");

export const createDirectConversationSchema = z.object({
  participantId: objectIdSchema,
});

export const createGroupConversationSchema = z.object({
  participantIds: z
    .array(objectIdSchema)
    .min(2, "A group requires at least two other participants."),

  name: z
    .string()
    .trim()
    .min(1, "Group name is required.")
    .max(100, "Group name cannot exceed 100 characters."),
});

export const addGroupParticipantSchema = z.object({
  participantId: objectIdSchema,
});

export const updateGroupNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Group name is required.")
    .max(100, "Group name cannot exceed 100 characters."),
});

export const createMessageSchema = z.object({
  content: messageContentSchema,
});

export const updateMessageSchema = z.object({
  content: messageContentSchema,
});

export const messagePaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),

  skip: z.coerce.number().int().min(0).default(0),
});
