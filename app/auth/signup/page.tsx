"use client";
import { logger } from '@/lib/monitoring/logger';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
    business_name: '',
    owner_name: '',
    mobile: '',
    referral_code: '',
    location: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate a random 8 char uppercase alphanumeric code (SSR-safe)
  function generateReferralCode() {
    if (typeof window === 'undefined') return 'AUTO' + Date.now();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  }

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    logger.info('[Signup] Before validation', { form });
    const businessName = form.business_name;
    const ownerName = form.owner_name;
    const phone = form.mobile;
    const email = form.email;
    const password = form.password;
    const location = form.location;
    const referralCodeInput = form.referral_code;
    const cleanedBusinessName = businessName.trim();
    const cleanedOwnerName = ownerName.trim();
    const cleanedPhone = phone.trim();
    const cleanedEmail = email.trim();
    const cleanedPassword = password.trim();
    const cleanedLocation = location?.trim();
    const cleanedReferralCode = referralCodeInput?.trim().toUpperCase();
    const isInvalid = [
      cleanedBusinessName,
      cleanedOwnerName,
      cleanedPhone,
      cleanedEmail,
      cleanedPassword
    ].some((field) => !field || field.trim() === '');
    if (isInvalid) {
      setError("Business Name, Name, Mobile, Email and Password are required.");
      setLoading(false);
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setError('Supabase client not configured. Check environment variables.');
      setLoading(false);
      return;
    }
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      if (authError.message && authError.message.includes('User already registered')) {
        setError('Account already exists. Please login.');
      } else {
        setError(authError.message || 'Signup failed: Unknown auth error.');
      }
      setLoading(false);
      return;
    }
    let referredBy: string | null = null;
    if (referralCodeInput) {
      const { data: refDealer, error: refError } = await supabase
        .from('dealers')
        .select('id')
        .eq('referral_code', referralCodeInput)
        .maybeSingle();
      if (refDealer && !refError) {
        referredBy = refDealer.id;
      }
    }
    let newReferralCode = '';
    try {
      newReferralCode = generateReferralCode();
    } catch (e) {
      newReferralCode = 'AUTO' + Date.now();
    }
    const userId = authData?.user?.id;
    if (!userId) {
      setError('Signup failed: No user ID returned.');
      setLoading(false);
      return;
    }
    const dealerInsertPayload = {
      user_id: userId,
      name: cleanedBusinessName,
      city: cleanedLocation || null,
      phone: cleanedPhone,
      referral_code: cleanedReferralCode || null,
      featured_ads_credit: 0,
      hot_deal_credit: 0,
      total_listings: 0,
      referral_rewarded: false
    };
    const { data: dealer, error: dealerError } = await supabase
      .from('dealers')
      .insert([
        dealerInsertPayload,
      ])
      .select()
      .single();
    if (dealerError || !dealer) {
      setError(dealerError?.message || 'Signup failed: Could not create dealer profile.');
      setLoading(false);
      return;
    }
    if (referredBy) {
      try {
        await supabase.rpc('reward_referrer', { new_dealer: dealer.id });
      } catch (e) {}
    }
    setLoading(false);
    router.push('/dealer/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white px-4">
      <div className="mb-8">
        <Logo />
      </div>
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
          <a href="/auth/login" className="text-yellow-600 dark:text-yellow-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}
