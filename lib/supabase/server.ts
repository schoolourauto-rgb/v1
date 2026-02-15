
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

export async function createServerClient() {
  const cookieStore = await cookies()

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ")

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Cookie: cookieHeader,
        },
      },
    }
  )
}
