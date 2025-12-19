import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000'),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    ADMIN_NAME: z.string().optional(),
    ADMIN_EMAIL: z.string().email().optional(),
    ADMIN_PASSWORD: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

export const env = _env.data;
