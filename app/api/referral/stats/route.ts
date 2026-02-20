import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const userId = session.user.id;

  // Get credits and stats
  const { data: profile } = await supabase.from('profiles').select('referral_code, future_ad_credits, hot_deal_credits, total_listings').eq('id', userId).single();
  const { count: total_referrals } = await supabase.from('referral_rewards').select('*', { count: 'exact', head: true }).eq('referrer_id', userId);

  return NextResponse.json({
    referral_code: profile?.referral_code,
    total_referrals: total_referrals || 0,
    future_ad_credits: profile?.future_ad_credits || 0,
    hot_deal_credits: profile?.hot_deal_credits || 0,
    total_listings: profile?.total_listings || 0,
  });
}
