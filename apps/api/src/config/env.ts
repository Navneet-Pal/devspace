import { z } from "zod";

import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  MONGODB_URL: z.string().min(1, "MongoDB URL is required"),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT access secret must be least 32 characters"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT refresh secret must be least 32 characters"),

  JWT_ACCESS_EXPIRES_IN: z.enum(["15m", "30m", "1h"]),

  JWT_REFRESH_EXPIRES_IN: z.enum(["7d", "30d"]),

  CLIENT_URL: z.string().url(),

  SMTP_EMAIL: z.string().email(),

  SMTP_PASSWORD: z.string().min(1),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),

  CLOUDINARY_API_KEY: z.string().min(1),

  CLOUDINARY_API_SECRET: z.string().min(1),

  // GitHub App
  GITHUB_APP_ID: z.string().min(1, "GitHub App ID is required"),

  GITHUB_APP_PRIVATE_KEY: z
    .string()
    .min(1, "GitHub App private key is required"),

  GITHUB_APP_SLUG: z.string().min(1, "GitHub App slug is required"),

  GITHUB_APP_BASE_URL: z
    .string()
    .url("GitHub App base URL must be a valid URL"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.log("Invalid environment variable");

  console.log(parsed.error.format());

  process.exit(1);
}

export const env = parsed.data;
