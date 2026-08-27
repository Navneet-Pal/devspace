import { z } from "zod";
import { Types } from "mongoose";
import { TASK_PRIORITY, TASK_STATUS } from "./types.js";

const objectIdSchema = z
  .string()
  .refine((value) => Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  });

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(5000, "Task description cannot exceed 5000 characters")
    .optional(),

  assignedTo: objectIdSchema.nullable().optional(),

  status: z
    .enum(Object.values(TASK_STATUS) as [string, ...string[]])
    .optional(),

  priority: z
    .enum(Object.values(TASK_PRIORITY) as [string, ...string[]])
    .optional(),

  dueDate: z.coerce.date().nullable().optional(),

  position: z.number().finite().optional(),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Task title cannot be empty")
      .max(200, "Task title cannot exceed 200 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(5000, "Task description cannot exceed 5000 characters")
      .optional(),

    dueDate: z.coerce.date().nullable().optional(),
  })
  .strict();

export const updateTaskStatusSchema = z.object({
  status: z.enum(Object.values(TASK_STATUS) as [string, ...string[]]),
});

export const updateTaskPrioritySchema = z.object({
  priority: z.enum(Object.values(TASK_PRIORITY) as [string, ...string[]]),
});

export const updateTaskAssigneeSchema = z.object({
  assignedTo: objectIdSchema.nullable(),
});

export const updateTaskPositionSchema = z.object({
  position: z.number().finite(),
});
