"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient();
      if (!supabase) {
        setError('Supabase client not configured. Check environment variables.')
        setLoading(false)
        return
      }
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (loginError) {
        setError(loginError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        router.push('/dealer/dashboard')
      }
    } catch (err) {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background via-background to-muted dark:from-black dark:via-neutral-950 dark:to-black">
      <div className="w-full max-w-md bg-card backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-6">
        <h1 className="text-4xl md:text-3xl font-bold mb-2">
          Dealer Login
        </h1>
        <p className="text-muted-foreground mb-6">
          Access your dashboard
        </p>
        {error && (
          <div className="bg-danger/10 border border-danger/40 text-danger rounded-2xl p-3 text-sm mb-4">
            {error}
          </div>
        )}
        <div className="space-y-3 mb-6">
          <input
            placeholder="Email"
            type="email"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-lg font-medium hover:opacity-90 transition-all"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-yellow-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
