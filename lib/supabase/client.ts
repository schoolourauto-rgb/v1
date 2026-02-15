import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createSupabaseClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}
