
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReferralCode } from '@/lib/utils/generateReferralCode';
import { SignupSchema } from '@/lib/validation/zodSchemas';
import { validateJsonRequest } from '@/lib/validation/validateRequest';
import { rateLimit } from "@/middleware/rateLimit";
import { withErrorHandler } from "@/lib/api/withErrorHandler";

export const POST = withErrorHandler(async (req: NextRequest) => {
  // Rate limit
  const rl = rateLimit(req);
  if (rl) return rl;
  const validation = await validateJsonRequest(req, SignupSchema);
  if (validation.error) return validation.response;
  const { businessName, ownerName, phone, email, password, referralCode, location } = validation.data;
  const supabase = await createClient();
  // 1. Handle referral code (if provided)
  let referredBy: string | null = null;
  if (referralCode && typeof referralCode === 'string') {
    const { data: refDealer, error: refError } = await supabase
      .from('dealers')
      .select('id')
      .eq('referral_code', referralCode.trim().toUpperCase())
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
        name: businessName.trim(),
        owner_name: ownerName.trim(),
        city: location?.trim() || '',
        phone: phone.trim(),
        email: email.trim(),
        referral_code: newReferralCode,
        referred_by: referredBy,
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
});
