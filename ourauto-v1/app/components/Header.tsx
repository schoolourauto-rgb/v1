'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <header className="border-b border-zinc-800 bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-500 transition">
          OurAuto
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link href="/marketplace" className="text-zinc-400 hover:text-white transition text-sm">
            Browse Cars
          </Link>

          {!loading && (
            <>
              {!user ? (
                <div className="flex gap-4 items-center">
                  <Link
                    href="/login"
                    className="text-zinc-400 hover:text-white transition text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-lg transition text-sm"
                  >
                    Become Dealer
                  </Link>
                </div>
              ) : (
                <div className="flex gap-4 items-center">
                  <Link
                    href="/dealer/dashboard"
                    className="text-zinc-400 hover:text-white transition text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-3 pl-4 border-l border-zinc-700">
                    <span className="text-sm text-zinc-400">{user.email}</span>
                    <button
                      onClick={handleLogout}
                      className="text-zinc-400 hover:text-red-400 transition text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
