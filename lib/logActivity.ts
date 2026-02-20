import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function logActivity({
  dealerId,
  userId,
  actionType,
  entityType,
  entityId,
  metadata,
  ip
}: {
  dealerId?: string;
  userId?: string;
  actionType: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}) {
  const supabase = await createClient();

  const ip_hash = ip
    ? crypto.createHash("sha256").update(ip).digest("hex")
    : null;

  await supabase.from("activity_logs").insert([
    {
      dealer_id: dealerId ?? null,
      user_id: userId ?? null,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId ?? null,
      metadata: metadata ?? null,
      ip_hash,
    },
  ]);
}
