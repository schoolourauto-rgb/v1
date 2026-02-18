
import { z } from "zod";
import { logger } from './monitoring/logger';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  // Only client env vars allowed here
});

const _env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const parsed = envSchema.safeParse(_env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  logger.error('Invalid environment variables', { error: parsed.error.flatten() });
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
