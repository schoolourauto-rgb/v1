'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()
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
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="bg-card text-card-foreground border border-border p-8 rounded-xl shadow-sm w-full max-w-md space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Dealer Login</h1>
          <p className="text-muted-foreground text-sm">Access Your OurAuto Dashboard</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-300 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            placeholder="Email"
            type="email"
            className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold p-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className="text-yellow-500 hover:underline">
              Sign up
            </Link>
          </p>
          <p>
            <button
              className="text-yellow-500 hover:underline"
              onClick={async () => {
                if (!form.email) {
                  setError('Enter your email to reset password.')
                  return
                }
                setLoading(true)
                setError(null)
                try {
                  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ourauto.in'
                  const { error: resetError } = await supabase.auth.resetPasswordForEmail(form.email, {
                    redirectTo: `${siteUrl}/reset-password`
                  })
                  if (resetError) {
                    setError(resetError.message)
                  } else {
                    setError('Password reset email sent. Check your inbox.')
                  }
                } catch (err) {
                  setError('Failed to send reset email.')
                }
                setLoading(false)
              }}
              disabled={loading}
            >
              Forgot password?
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
