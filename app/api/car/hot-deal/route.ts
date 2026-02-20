import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { car_id } = await req.json();
  if (!car_id) return NextResponse.json({ error: 'Car ID required' }, { status: 400 });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const userId = session.user.id;
  // Only allow if user owns the car (optional: add check)
  const { error } = await supabase.rpc('use_hot_deal_credit', { user_id: userId, car_id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
