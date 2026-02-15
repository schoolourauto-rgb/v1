import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Admin client for service role usage only (never in browser)
export const adminSupabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
