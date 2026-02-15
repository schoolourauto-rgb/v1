// Service for leads business logic
import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

export class LeadsService {
  static async createLead(payload: LeadInsert) {
    const supabase = createServerClient();
    if (!supabase) throw new Error("Supabase client not configured");
    const { error } = await supabase.from("leads").insert([payload]);
    if (error) throw new Error(error.message);
    return true;
  }
}
