import { z } from "zod";

import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int("PORT must be an integer")
    .positive("PORT must be greater than 0")
    .default(5000),

  MONGODB_URL: z.string().trim().min(1, "MongoDB URL is required"),

  JWT_ACCESS_SECRET: z
    .string()
    .trim()
    .min(32, "JWT access secret must be at least 32 characters"),

  JWT_REFRESH_SECRET: z
    .string()
    .trim()
    .min(32, "JWT refresh secret must be at least 32 characters"),

  JWT_ACCESS_EXPIRES_IN: z.enum(["15m", "30m", "1h"]),

  JWT_REFRESH_EXPIRES_IN: z.enum(["7d", "30d"]),

  CLIENT_URL: z.string().trim().url("Client URL must be a valid URL"),

  SMTP_EMAIL: z.string().trim().email("SMTP email must be a valid email"),

  SMTP_PASSWORD: z.string().trim().min(1, "SMTP password is required"),

  CLOUDINARY_CLOUD_NAME: z
    .string()
    .trim()
    .min(1, "Cloudinary cloud name is required"),

  CLOUDINARY_API_KEY: z
    .string()
    .trim()
    .min(1, "Cloudinary API key is required"),

  CLOUDINARY_API_SECRET: z
    .string()
    .trim()
    .min(1, "Cloudinary API secret is required"),

  // GitHub App
  GITHUB_APP_ID: z.string().trim().min(1, "GitHub App ID is required"),

  GITHUB_APP_PRIVATE_KEY: z
    .string()
    .min(1, "GitHub App private key is required"),

  GITHUB_APP_SLUG: z.string().trim().min(1, "GitHub App slug is required"),

  GITHUB_APP_BASE_URL: z
    .string()
    .trim()
    .url("GitHub App base URL must be a valid URL"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
