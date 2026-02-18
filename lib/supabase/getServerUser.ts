
import { createClient } from "@/lib/supabase/server";
import { logger } from '../monitoring/logger';

/**
 * Returns the current session user (server-side) or null if not authenticated.
 */
export async function getServerUser(): Promise<{ id: string; email: string | null } | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      logger.error('getServerUser auth error', { error });
      return null;
    }
    if (!user) return null;
    return { id: user.id, email: user.email ?? null };
  } catch (err) {
    logger.error('getServerUser exception', { err });
    return null;
  }
}
