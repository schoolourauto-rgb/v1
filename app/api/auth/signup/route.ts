

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReferralCode } from '@/lib/utils/generateReferralCode';
import { signupSchema } from '@/lib/validation/zodSchemas';

export async function POST(req: NextRequest) {
  // 1️⃣ Content-Type check
  if (req.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  // 2️⃣ Parse body and log
  let body: any;
  try {
    body = await req.json();
    console.log('BODY RECEIVED:', JSON.stringify(body));
  } catch (err) {
    console.error('BODY PARSE ERROR:', err);
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 });
  }

  // 3️⃣ Zod validation with detailed error
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    console.error('ZOD ERROR:', parsed.error.flatten());
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: parsed.error.flatten(),
      },
      { status: 422 }
    );
  }
  const {
    business_name,
    contact_person,
    phone,
    email,
    password,
    location,
    referral_code,
  } = parsed.data;

  const supabase = await createClient();

  // 4️⃣ Create Supabase Auth user
  const { data: authUser, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError || !authUser?.user) {
    return NextResponse.json({ error: authError?.message || 'Signup failed' }, { status: 400 });
  }

  // 5️⃣ Prepare dealer insert
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

  // 6️⃣ Insert dealer record (mapping snake_case → DB columns)
  try {
    const { error: dealerInsertError } = await supabase
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

    if (dealerInsertError) {
      // Rollback auth user
      try {
        await supabase.auth.admin.deleteUser(authUser.user.id);
      } catch {}
      console.error('Dealer insert error:', dealerInsertError);
      return NextResponse.json(
        { error: 'Dealer creation failed' },
        { status: 500 }
      );
    }
  } catch (err) {
    // Rollback auth user
    try {
      await supabase.auth.admin.deleteUser(authUser.user.id);
    } catch {}
    console.error('Unexpected dealer insert error:', err);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }

  // 7️⃣ Success response
  return NextResponse.json({
    success: true,
    message: 'Account created successfully',
  });
}
