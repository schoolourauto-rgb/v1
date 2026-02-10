'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const [showInstall, setShowInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)

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

  // PWA install popup logic
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Location fetch on login
  useEffect(() => {
    if (!user) return
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        localStorage.setItem('lat', String(position.coords.latitude))
        localStorage.setItem('lng', String(position.coords.longitude))
      },
      (error) => {
        // Optionally handle error
      }
    )
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstall(false)
    }
  }

  const handleGetLocation = () => {
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        localStorage.setItem('lat', String(position.coords.latitude))
        localStorage.setItem('lng', String(position.coords.longitude))
      },
      (error) => {
        // Optionally handle error
      }
    )
  }

  return (
    <header className="border-b border-zinc-800 bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-foreground hover:text-yellow-500 transition">
          OurAuto
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link href="/marketplace" className="text-zinc-400 hover:text-white transition text-sm">
            Browse Cars
          </Link>
          {/* Dark/Light toggle button */}
          <button
            aria-label="Toggle theme"
            className="rounded p-2 hover:bg-accent"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71m16.97 0l-.71-.71M4.05 4.93l-.71-.71M21 12h-1M4 12H3m9-9a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
            {/* Location button removed as per new UX */}
          {/* PWA Install button */}
          {showInstall && (
            <button
              className="rounded p-2 bg-primary text-white hover:bg-primary/80"
              onClick={handleInstall}
            >
              Install App
            </button>
          )}
          {!loading && (
            <>
              {!user ? (
                <div className="flex gap-4 items-center">
                  <div className="flex gap-3 items-center">
                    <Link
                      href="/login"
                      className="text-zinc-400 hover:text-white transition text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-yellow-500 hover:bg-yellow-600 text-foreground font-semibold px-5 py-2 rounded-2xl shadow-lg backdrop-blur-sm border border-border transition text-sm hover:scale-[1.02] active:scale-95 duration-200"
                    >
                      Become Dealer
                    </Link>
                  </div>
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
