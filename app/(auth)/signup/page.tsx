'use client'

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { generateReferralCode } from '@/lib/utils/generateReferralCode';

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
      setError('Supabase client not configured. Check environment variables.');
      setLoading(false);
      return;
    }

    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      if (authError.message.includes('User already registered')) {
        setError('Account already exists. Please login.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    // 2. Prepare dealer insert
    let referredBy: string | null = null;
    const referralCodeInput = form.referral_code.trim().toUpperCase();
    if (referralCodeInput) {
      // Check if referral code exists
      const { data: refDealer, error: refError } = await supabase
        .from('dealers')
        .select('id')
        .eq('referral_code', referralCodeInput)
        .maybeSingle();
      if (refDealer && !refError) {
        referredBy = refDealer.id;
      }
    }

    // 3. Generate unique referral code for this dealer
    let newReferralCode = '';
    try {
      newReferralCode = await generateReferralCode();
    } catch (e) {
      // fallback: random code (should not happen)
      newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    // 4. Insert dealer row
    const userId = authData?.user?.id;
    if (!userId) {
      setError('Signup failed: No user ID returned.');
      setLoading(false);
      return;
    }
    const { data: dealer, error: dealerError } = await supabase
      .from('dealers')
      .insert([
        {
          user_id: userId,
          dealership_name: form.business_name,
          phone: form.mobile,
          referral_code: newReferralCode,
          referred_by: referredBy,
          verified: false,
        },
      ])
      .select('id')
      .maybeSingle();
    if (dealerError || !dealer) {
      setError('Signup failed: Could not create dealer profile.');
      setLoading(false);
      return;
    }

    // 5. Call reward_referrer RPC if referredBy exists
    if (referredBy) {
      try {
        await supabase.rpc('reward_referrer', { new_dealer: dealer.id });
      } catch (e) {
        // Do not block signup, do not log in production
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Referral reward RPC failed', e);
        }
      }
    }

    setLoading(false);
    router.push('/dealer/dashboard');
  };

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
