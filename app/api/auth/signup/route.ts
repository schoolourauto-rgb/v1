import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReferralCode } from '@/lib/utils/generateReferralCode';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business_name, owner_name, mobile, email, password, referral_code: referralCodeInput, location } = body;
    if (!business_name || !owner_name || !mobile || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    const supabase = await createClient();
    // 1. Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
    });
    if (authError || !authData?.user?.id) {
      return NextResponse.json({ error: authError?.message || 'Signup failed.' }, { status: 400 });
    }
    const userId = authData.user.id;
    // 2. Handle referral code (if provided)
    let referredBy: string | null = null;
    if (referralCodeInput && typeof referralCodeInput === 'string') {
      const { data: refDealer, error: refError } = await supabase
        .from('dealers')
        .select('id')
        .eq('referral_code', referralCodeInput.trim().toUpperCase())
        .maybeSingle();
      if (refDealer && !refError) {
        referredBy = refDealer.id;
      }
    }
    // 3. Generate unique referral code
    let newReferralCode = '';
    try {
      newReferralCode = await generateReferralCode();
    } catch {
      newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    // 4. Insert dealer row
    const { data: dealer, error: dealerError } = await supabase
      .from('dealers')
      .insert([
        {
          user_id: userId,
          dealership_name: business_name,
          owner_name,
          phone: mobile,
          referral_code: newReferralCode,
          referred_by: referredBy,
          location,
          verified: false,
        },
      ])
      .select('id')
      .maybeSingle();
    if (dealerError || !dealer) {
      return NextResponse.json({ error: 'Could not create dealer profile.' }, { status: 400 });
    }
    // 5. Call reward_referrer RPC if referredBy exists
    if (referredBy) {
      try {
        await supabase.rpc('reward_referrer', { new_dealer: dealer.id });
      } catch {}
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error.' }, { status: 500 });
  }
}
