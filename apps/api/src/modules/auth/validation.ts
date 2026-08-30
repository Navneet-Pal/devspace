import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 character")
    .max(50, "Name must not exceed 50 characters"),

  email: z.email().trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid Email").trim().toLowerCase(),

  password: z.string().min(8, "Password must be at lease 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().uuid(),

  password: z.string().min(8),
});

export type resetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 character")
      .max(50, "Name must not exceed 50 characters")
      .optional(),

    email: z.email("Invalid Email").trim().toLowerCase().optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "At least one profile field is required.",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
