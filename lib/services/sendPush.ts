import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
  "mailto:admin@yourdomain.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPush(dealerId: string, payload: { title: string; body: string; url: string }, type: 'chat' | 'leads' | 'broadcast' = 'chat') {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // Fetch dealer notification settings
  const { data: dealer } = await supabase.from("dealers").select("notification_settings").eq("id", dealerId).single();
  if (!dealer || !dealer.notification_settings) return;

  // Respect notification settings
  if (type === 'chat' && dealer.notification_settings.chat === false) return;
  if (type === 'leads' && dealer.notification_settings.leads === false) return;
  if (type === 'broadcast' && dealer.notification_settings.broadcast === false) return;

  const { data: subs } = await supabase.from("push_subscriptions").select("*").eq("dealer_id", dealerId);
  if (!subs || subs.length === 0) return;

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload)
      );
    } catch (e: any) {
      if (e.statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("id", sub.id);
      }
      // Silently catch other errors
    }
  }
}
