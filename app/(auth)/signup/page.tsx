'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const supabase = createClient()
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

    try {
      // 1. Create user
      const { data, error: signupError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (signupError) {
        setError(signupError.message);
        setLoading(false);
        return;
      }
      const user = data.user;
      if (!user) {
        setError('Failed to create user');
        setLoading(false);
        return;
      }

      // 2. Find referrer dealer if referral code entered
      let referred_by: string | null = null;
      if (form.referral_code) {
        const { data: refDealers, error: refFindErr } = await supabase
          .from('dealers')
          .select('id')
          .eq('referral_code', form.referral_code.trim().toUpperCase())
          .maybeSingle();
        if (!refFindErr && refDealers && refDealers.id) {
          referred_by = refDealers.id;
        }
      }

      // 3. Create dealer row with unique referral_code
      let newReferralCode = generateReferralCode();
      let codeUnique = false;
      for (let i = 0; i < 5 && !codeUnique; i++) {
        const { data: exists } = await supabase
          .from('dealers')
          .select('id')
          .eq('referral_code', newReferralCode)
          .maybeSingle();
        if (!exists) codeUnique = true;
        else newReferralCode = generateReferralCode();
      }

      const { data: dealerRow, error: dealerError } = await supabase
        .from('dealers')
        .insert({
          user_id: user.id,
          dealership_name: form.business_name,
          phone: form.mobile,
          location: null,
          verified: false,
          referral_code: newReferralCode,
          referred_by,
        })
        .select()
        .maybeSingle();
      if (dealerError || !dealerRow) {
        console.error('Dealer profile creation error:', dealerError);
        setError(dealerError?.message || 'Failed to create dealer profile');
        setLoading(false);
        return;
      }

      // 4. Create wallet row
      await supabase.from('dealer_wallet').insert({
        dealer_id: dealerRow.id,
        featured_credits: 5,
        first_car_published: false,
        total_reward_credits: 0,
      });

      // 5. Create profile row (for auth)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        business_name: form.business_name,
        owner_name: form.owner_name,
        mobile: form.mobile,
        role: 'dealer',
      });
      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      router.push('/dealer/dashboard');
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
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
