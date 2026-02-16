'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  // create supabase client instance
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: '',
    business_name: '',
    owner_name: '',
    mobile: '',
    referral_code: '', // code entered by new dealer (optional)
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate a random 6-8 char uppercase alphanumeric code
  function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  }

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError('Supabase client not configured. Check environment variables.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        setError("Account already exists. Please login.");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/dealer/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="bg-card text-card-foreground border border-border p-8 rounded-xl shadow-sm w-full max-w-md space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Dealer Signup</h1>
          <p className="text-muted-foreground text-sm">Join OurAuto Marketplace</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/40 text-danger rounded-2xl p-3 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            placeholder="Business Name"
            className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            disabled={loading}
          />

          <input
            placeholder="Owner Name"
            className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
            value={form.owner_name}
            onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
            disabled={loading}
          />

          <input
            placeholder="Mobile"
            className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            disabled={loading}
          />

          <input
            placeholder="Referral Code (optional)"
            className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
            value={form.referral_code}
            onChange={(e) => setForm({ ...form, referral_code: e.target.value })}
            disabled={loading}
            maxLength={8}
            style={{ textTransform: 'uppercase' }}
          />

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
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold p-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-center text-muted-foreground text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-yellow-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}
