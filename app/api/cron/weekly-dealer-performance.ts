import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: dealers } = await supabase.from('dealers').select('id, dealership_name, user_id');
  if (!dealers) return Response.json({ error: 'No dealers' }, { status: 404 });

  for (const dealer of dealers) {
    const { data: cars } = await supabase
      .from('cars')
      .select('id, views, leads, created_at')
      .eq('dealer_id', dealer.id)
      .eq('status', 'active');
    const totalViews = cars?.reduce((sum, c) => sum + (c.views || 0), 0) || 0;
    const totalLeads = cars?.reduce((sum, c) => sum + (c.leads || 0), 0) || 0;
    const hotDeals = cars?.filter((c) => (c.views || 0) > 50 || (c.leads || 0) > 5).length || 0;

    // Get dealer email
    const { data: user } = await supabase.from('profiles').select('id, email').eq('id', dealer.user_id).maybeSingle();
    if (!user?.email) continue;

    // Send email
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: 'OurAuto <noreply@ourauto.in>',
      to: user.email,
      subject: 'Your Weekly Performance on OurAuto',
      html: `<h2>This week:</h2><ul><li>${totalViews} views</li><li>${totalLeads} leads</li><li>${hotDeals} hot deals</li></ul><p>Boost visibility? Share more cars!</p>`
    });
  }
  return Response.json({ status: 'ok' });
}
