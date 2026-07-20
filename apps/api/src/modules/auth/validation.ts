
import {z} from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(3,"Name must be at least 3 character").max(50,"Name must not exceed 50 characters"),
    email:z.email().trim().toLowerCase(),
    password:z.string().min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
    email : z.email("Invalid Email").trim().toLowerCase(),
    password : z.string().min(8,"Password must be at lease 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
    email : z.string().email(),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    token : z.string().uuid(),
    password: z.string().min(8)
});

export type resetPasswordInput = z.infer<typeof resetPasswordSchema >;