import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Returns the current session user (server-side) or null if not authenticated.
 */
export async function getServerUser(): Promise<{ id: string; email: string | null } | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase env variables");
      return null;
    }
    const cookieStore = cookies();
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: { headers: { Cookie: cookieStore.toString() } },
        auth: { persistSession: false },
      }
    );
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
