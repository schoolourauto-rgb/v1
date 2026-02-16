'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
    location: '',
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

    // Console log: before validation
    console.log("[Signup] Before validation", form);

    // Validation
    const businessName = form.business_name.trim();
    const ownerName = form.owner_name.trim();
    const phone = form.mobile.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const location = form.location.trim();
    const referralCodeInput = form.referral_code.trim().toUpperCase();

    // Console log: after validation values
    console.log("[Signup] After validation values", { businessName, ownerName, phone, email, password, location });

    // Log each variable individually
    console.log("[Signup] businessName:", businessName);
    console.log("[Signup] ownerName:", ownerName);
    console.log("[Signup] phone:", phone);
    console.log("[Signup] email:", email);
    console.log("[Signup] password:", password);
    console.log("[Signup] location:", location);

    // Nuclear safe validation
    const isInvalid = [
      businessName,
      ownerName,
      phone,
      email,
      password,
      location
    ].some((field) => !field || field.trim() === '');

    if (isInvalid) {
      console.log("[Signup] Validation failed: missing required fields", { businessName, ownerName, phone, email, password, location });
      setError('Missing required fields');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError('Supabase client not configured. Check environment variables.');
      setLoading(false);
      return;
    }

    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    // Console log: after auth
    console.log("[Signup] After Supabase auth", { authData, authError });

    if (authError) {
      console.log("Supabase auth error:", authError);
      if (authError.message && authError.message.includes('User already registered')) {
        setError('Account already exists. Please login.');
      } else {
        setError(authError.message || 'Signup failed: Unknown auth error.');
      }
      setLoading(false);
      return;
    }

    // 2. Prepare dealer insert
    let referredBy: string | null = null;
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
    const dealerInsertPayload = {
      user_id: userId,
      name: businessName.trim(),
      city: location.trim(),
      phone: phone.trim(),
      referral_code: newReferralCode,
      featured_ads_credit: 0,
      hot_deal_credit: 0,
      total_listings: 0,
      referral_rewarded: false
    };
    // Console log: before dealer insert
    console.log("[Signup] Before dealer insert", dealerInsertPayload);
    const { data: dealer, error: dealerError } = await supabase
      .from('dealers')
      .insert([
        dealerInsertPayload,
      ])
      .select()
      .single();
    // Console log: after dealer insert
    console.log("[Signup] After dealer insert", { dealer, dealerError });
    if (dealerError || !dealer) {
      console.log("Dealer insert error:", dealerError);
      setError(dealerError?.message || 'Signup failed: Could not create dealer profile.');
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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white px-4">
      <div className="bg-white dark:bg-neutral-950 text-black dark:text-white border border-gray-200 dark:border-neutral-800 p-8 rounded-xl shadow-sm w-full max-w-md space-y-4 transition-colors">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Dealer Signup</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Join OurAuto Marketplace</p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-2xl p-3 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            placeholder="Business Name"
            className="w-full p-3 bg-white dark:bg-neutral-900 text-black dark:text-white border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-colors duration-200"
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            disabled={loading}
          />

          <input
            placeholder="Location"
            className="w-full p-3 bg-white dark:bg-neutral-900 text-black dark:text-white border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-colors duration-200"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            disabled={loading}
          />

          <input
            placeholder="Owner Name"
            className="w-full p-3 bg-white dark:bg-neutral-900 text-black dark:text-white border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-colors duration-200"
            value={form.owner_name}
            onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
            disabled={loading}
          />

          <input
            placeholder="Mobile"
            className="w-full p-3 bg-white dark:bg-neutral-900 text-black dark:text-white border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-colors duration-200"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            disabled={loading}
          />

          <input
            placeholder="Referral Code (optional)"
            className="w-full p-3 bg-white dark:bg-neutral-900 text-black dark:text-white border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-colors duration-200 uppercase"
            value={form.referral_code}
            onChange={(e) => setForm({ ...form, referral_code: e.target.value })}
            disabled={loading}
            maxLength={8}
          />

          <input
            placeholder="Email"
            type="email"
            className="w-full p-3 bg-white dark:bg-neutral-900 text-black dark:text-white border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-colors duration-200"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-white dark:bg-neutral-900 text-black dark:text-white border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-colors duration-200"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-yellow-400 dark:bg-yellow-500 hover:opacity-90 text-black dark:text-neutral-950 font-semibold p-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-yellow-600 dark:text-yellow-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}
