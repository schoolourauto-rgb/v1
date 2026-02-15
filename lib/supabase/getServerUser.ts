import { createServerClientTyped } from "@/lib/supabase/server";

/**
 * Returns the current session user (server-side) or null if not authenticated.
 */
export async function getServerUser(): Promise<{ id: string; email: string | null } | null> {
  try {
    const supabase = await createServerClientTyped();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("getServerUser auth error", error);
      return null;
    }
    if (!user) return null;
    return { id: user.id, email: user.email ?? null };
  } catch (err) {
    console.error("getServerUser exception", err);
    return null;
  }
}
