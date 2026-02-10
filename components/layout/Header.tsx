"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function Header() {
  const { theme } = useTheme()
  return (
    <header
      className={`border-b w-full ${
        theme === "dark" ? "bg-black border-border" : "bg-white border-gray-200"
      }`}
    >
      <div className="mx-auto max-w-[1280px] flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center" aria-label="OurAuto Home">
          <Image
            src="/logo.png"
            alt="OurAuto Logo"
            width={140}
            height={40}
            priority
            className="hidden md:block h-10 w-auto"
          />
          <Image
            src="/logo.png"
            alt="OurAuto Logo"
            width={110}
            height={32}
            priority
            className="md:hidden h-8 w-auto"
          />
        </Link>
        <nav className="flex items-center space-x-4">
          {/* Add navigation links here */}
          <div className="md:hidden">
            {/* Mobile menu placeholder */}
            <button
              className="rounded-lg p-2 text-gray-500 hover:text-primary focus:outline-none"
              aria-label="Open mobile menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
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
