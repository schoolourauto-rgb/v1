// adminSupabase removed. Replace with server client if needed.
import { logActivity } from "@/lib/logActivity";
import type { Json } from "@/lib/supabase/types";

/**
 * Deduct trust score for a dealer, never below 0
 */
// Removed deductTrustScore and all adminSupabase usage. Functionality must be reimplemented with server client if needed.

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
  // Removed all adminSupabase code. Functionality must be reimplemented with server client if needed.
  // TODO: Implement other rules (price changes, suspension flags, duplicate IP leads)
}
