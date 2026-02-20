import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { ad_id } = await req.json();
  if (!ad_id) return NextResponse.json({ error: 'Ad ID required' }, { status: 400 });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const userId = session.user.id;
  // Only allow if user owns the ad (optional: add check)
  const { error } = await supabase.rpc('use_future_ad_credit', { user_id: userId, ad_id });
  if (error) return NextResponse.json({ error: "Could not apply future ad credit" }, { status: 400 });
  return NextResponse.json({ success: true });
}
