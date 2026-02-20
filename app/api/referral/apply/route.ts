
import { createClient } from '@/lib/supabase/server';
import { ensureReferralCode } from '@/lib/utils/referral';
import { NextRequest, NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';
import { rateLimit } from '@/middleware/rateLimit';
import { logError } from '@/lib/logger';

export async function POST(req: NextRequest) {
  // Enforce rate limit
  const rl = rateLimit(req);
  if (rl) return rl;
  try {
    const supabase = await createClient();
    const { referral_code } = await req.json();
    if (!referral_code) {
      return NextResponse.json(apiError('Referral code required'), { status: 400 });
    }
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json(apiError('Not authenticated'), { status: 401 });
    const userId = session.user.id;

    // Get referrer profile
    const { data: referrer } = await supabase.from('profiles').select('id').eq('referral_code', referral_code).maybeSingle();
    if (!referrer) return NextResponse.json(apiError('Referral code invalid'), { status: 404 });
    if (referrer.id === userId) return NextResponse.json(apiError('Cannot refer yourself'), { status: 400 });

    // Get current user profile
    const { data: profile } = await supabase.from('profiles').select('referred_by').eq('id', userId).single();
    if (profile?.referred_by) return NextResponse.json(apiError('Referral already applied'), { status: 400 });

    // Transaction: Insert referral, update credits
    const { error: insertError } = await supabase.rpc('apply_referral_reward', { referrer_id: referrer.id, referred_id: userId });
    if (insertError) return NextResponse.json(apiError('Could not apply referral reward'), { status: 500 });

    return NextResponse.json(apiSuccess(true), { status: 200 });
  } catch (e) {
    logError('Referral apply error', e);
    return NextResponse.json(apiError(), { status: 500 });
  }
}
