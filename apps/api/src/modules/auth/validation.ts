
import {z} from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(3,"Name must be at least 3 character").max(50,"Name must not exceed 50 characters"),
    email:z.email().trim().toLowerCase(),
    password:z.string().min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;