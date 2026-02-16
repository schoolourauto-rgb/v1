

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReferralCode } from '@/lib/utils/generateReferralCode';
import { SignupSchema } from '@/lib/validation/zodSchemas';
import { validateJsonRequest } from '@/lib/validation/validateRequest';
import { rateLimit } from "@/middleware/rateLimit";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { randomUUID } from 'crypto';

export const POST = withErrorHandler(async (req: NextRequest) => {
  // Rate limit
  const rl = rateLimit(req);
  if (rl) return rl;

  const validation = await validateJsonRequest(req, SignupSchema);
  if (validation.error) return validation.response;

  const {
    business_name,
    contact_person,
    phone,
    email,
    password,
    location,
    referral_code,
  } = validation.data;

  const supabase = await createClient();

  // Step A: Create Supabase Auth user
  const { data: authUser, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError || !authUser?.user) {
    return NextResponse.json({ error: authError?.message || 'Signup failed' }, { status: 400 });
  }

  // Step B: Prepare dealer insert
  let referredBy: string | null = null;
  if (referral_code && typeof referral_code === 'string') {
    const { data: refDealer, error: refError } = await supabase
      .from('dealers')
      .select('id')
      .eq('referral_code', referral_code.trim().toUpperCase())
      .maybeSingle();
    if (refDealer && !refError) {
      referredBy = refDealer.id;
    }
  }

  let generatedReferralCode = '';
  try {
    generatedReferralCode = await generateReferralCode();
  } catch {
    generatedReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Step B: Insert dealer record
  let dealerInsertError = null;
  try {
    const { error: dealerError } = await supabase
      .from('dealers')
      .insert([
        {
          id: authUser.user.id,
          user_id: authUser.user.id,
          name: contact_person.trim(),
          dealership_name: business_name.trim(),
          city: location.trim(),
          phone: phone.trim(),
          referral_code: generatedReferralCode,
          referred_by: referredBy,
          verified: false,
          featured_ads_credit: 0,
          hot_deal_credit: 0,
          total_listings: 0,
          referral_rewarded: false,
        },
      ]);
    if (dealerError) {
      dealerInsertError = dealerError;
    }
  } catch (err) {
    dealerInsertError = err;
  }

  if (dealerInsertError) {
    // Rollback auth user
    try {
      await supabase.auth.admin.deleteUser(authUser.user.id);
    } catch {}
    console.error("Dealer insert error:", dealerInsertError);
    return NextResponse.json(
      { error: "Dealer creation failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Account created successfully"
  });
});
