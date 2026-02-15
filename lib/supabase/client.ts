

import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createClient<Database>> | undefined
}

export const supabase =
  globalForSupabase.supabase ??
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabase = supabase
}
