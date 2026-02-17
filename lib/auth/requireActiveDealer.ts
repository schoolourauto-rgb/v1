import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/logActivity";

export async function requireActiveDealer() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  const { data: dealer } = await supabase
    .from("dealers")
    .select("id, is_suspended")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!dealer) {
    throw new Error("DEALER_NOT_FOUND");
  }

  if (dealer.is_suspended) {
    await logActivity({
      user_id: user.id,
      action_type: "SUSPENDED_ACCESS_ATTEMPT",
      entity_type: "dealer",
      entity_id: dealer.id,
      metadata: {},
    });

    throw new Error("DEALER_SUSPENDED");
  }

  return { user, dealer };
}
