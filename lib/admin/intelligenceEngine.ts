import { adminSupabase } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/logActivity";

/**
 * Deduct trust score for a dealer, never below 0
 */
export async function deductTrustScore(dealerId: string, amount: number, reason: string, metadata: any = {}) {
  // Get current trust score
  const { data: dealer } = await adminSupabase
    .from("dealers")
    .select("trust_score")
    .eq("id", dealerId)
    .maybeSingle();
  if (!dealer) return;
  const newScore = Math.max(0, (dealer.trust_score ?? 100) - amount);
  await adminSupabase
    .from("dealers")
    .update({ trust_score: newScore })
    .eq("id", dealerId);
  // Insert fraud flag
  await adminSupabase.from("fraud_flags").insert([
    {
      dealer_id: dealerId,
      type: reason,
      severity: getSeverity(amount),
      metadata,
    },
  ]);
  // Auto-suspend if needed
  if (newScore <= 30) {
    await adminSupabase.from("dealers").update({ is_suspended: true }).eq("id", dealerId);
    await logActivity({
      dealerId,
      actionType: "AUTO_SUSPENSION",
      entityType: "dealer",
      entityId: dealerId,
      metadata: { reason: "Low trust score" },
    });
  }
}

function getSeverity(amount: number): number {
  if (amount >= 20) return 3;
  if (amount >= 10) return 2;
  return 1;
}

/**
 * Analyze dealer behavior after car/lead events
 * Call this after car create, update, delete, and lead creation
 */
export async function analyzeDealerBehavior({ dealerId, event, carId, leadId, ip, phone }: {
  dealerId: string;
  event: "car_create"|"car_update"|"car_delete"|"lead_create";
  carId?: string;
  leadId?: string;
  ip?: string;
  phone?: string;
}) {
  // Car deleted within 5 mins of posting
  if (event === "car_delete" && carId) {
    const { data: car } = await adminSupabase.from("cars").select("created_at").eq("id", carId).maybeSingle();
    if (car && Date.now() - new Date(car.created_at).getTime() < 5*60*1000) {
      await deductTrustScore(dealerId, 5, "car_deleted_quickly", { carId });
    }
  }
  // TODO: Implement other rules (price changes, suspension flags, duplicate IP leads, rapid posting)
}
