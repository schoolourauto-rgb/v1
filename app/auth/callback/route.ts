import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const code = requestUrl.searchParams.get("code")
  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.redirect(new URL("/dealer/dashboard", request.url))
}
