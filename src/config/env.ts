import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  RESET_PASSWORD_TOKEN_EXPIRES_MINUTES: z.coerce.number().default(30),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  CORS_ORIGIN: z.string().optional(),
  COOKIE_DOMAIN: z.string().optional(),
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_UPLOAD_MB: z.coerce.number().default(2048),
  REDIS_URL: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const data = parsed.data;

export const env = {
  ...data,
  isProduction: data.NODE_ENV === 'production',
  maxUploadSizeBytes: data.MAX_UPLOAD_MB * 1024 * 1024,
  corsOrigin: data.CORS_ORIGIN ? data.CORS_ORIGIN.split(',').map((v) => v.trim()) : [data.FRONTEND_URL]
};
