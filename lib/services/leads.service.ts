// Service for leads business logic
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

export class LeadsService {
  static async createLead(payload: LeadInsert) {
    const supabase = await createClient();
    // Fetch car to get dealer_id
    const { data: car, error: carError } = await supabase
      .from("cars")
      .select("dealer_id")
      .eq("id", payload.car_id)
      .single();
    if (carError || !car) {
      throw new Error("Car not found");
    }
    // Fetch dealer to check suspension
    const { data: dealer, error: dealerError } = await supabase
      .from("dealers")
      .select("is_suspended")
      .eq("id", car.dealer_id)
      .single();
    if (dealerError || !dealer) {
      throw new Error("Dealer not found");
    }
    if (dealer.is_suspended) {
      throw new Error("Dealer unavailable");
    }
    const { error } = await supabase.from("leads").insert([payload]);
    if (error) throw new Error(error.message);
    return true;
  }
}
