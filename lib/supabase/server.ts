import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing SUPABASE URL')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE ANON KEY')
  }
  // Optionally check for SERVICE_ROLE_KEY if used
  // if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  //   throw new Error('Missing SUPABASE SERVICE ROLE KEY')
  // }
  try {
    const cookieStore: any = cookies()
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
  } catch (err) {
    throw new Error('Supabase server client creation failed: ' + (err instanceof Error ? err.message : String(err)))
  }
}
