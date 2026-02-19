"use client"

import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export default function Topbar() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="font-semibold text-lg">Dealer Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </header>
  )
}
