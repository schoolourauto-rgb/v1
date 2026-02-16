import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReferralCode } from '@/lib/utils/generateReferralCode';

export async function POST(req: NextRequest) {
  try {
    // Log incoming request for debugging
    console.log('Signup API request body:', await req.clone().json());
    const body = await req.json();
    const {
      user_id,
      business_name,
      owner_name,
      phone,
      email,
      referral_code: referralCodeInput,
      location,
    } = body;
    if (
      !business_name?.trim() ||
      !owner_name?.trim() ||
      !phone?.trim() ||
      !email?.trim() ||
      !user_id?.trim()
    ) {
      console.error('Signup API error: Business Name, Name, Mobile, Email and Password are required.', body);
      return NextResponse.json(
        { error: 'Business Name, Name, Mobile, Email and Password are required.' },
        { status: 400 }
      );
    }
    const supabase = await createClient();
    // 1. Handle referral code (if provided)
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
    // 2. Generate unique referral code
    let newReferralCode = '';
    try {
      newReferralCode = await generateReferralCode();
    } catch {
      newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    // 3. Insert dealer row
      const { data: dealer, error: dealerError } = await supabase
        .from('dealers')
        .insert([
          {
            user_id,
            name: business_name.trim(),
            city: location.trim(),
            phone: phone.trim(),
            referral_code: newReferralCode,
            verified: false,
            featured_ads_credit: 0,
            total_listings: 0,
            referral_rewarded: false
          },
        ])
        .select('id')
        .single();
    if (dealerError || !dealer) {
      console.error('Signup API error: Dealer creation failed.', dealerError);
      return NextResponse.json({ error: dealerError?.message || 'Could not create dealer profile.' }, { status: 400 });
    }
    // 4. Call reward_referrer RPC if referredBy exists
    if (referredBy) {
      try {
        await supabase.rpc('reward_referrer', { new_dealer: dealer.id });
      } catch {}
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 400 });
  }
}
