import { createClient } from "@/lib/supabase/server";

/**
 * Generates a unique 8-character uppercase alphanumeric referral code.
 * Ensures uniqueness by checking the dealers table.
 */
export async function generateReferralCode(): Promise<string> {
  const supabase = await createClient();
  const CODE_LENGTH = 8;
  const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  function randomCode(): string {
    let code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
    }
    return code;
  }

  let unique = false;
  let code = "";
  while (!unique) {
    code = randomCode();
    const { data, error } = await supabase
      .from("dealers")
      .select("id")
      .eq("referral_code", code)
      .maybeSingle();
    if (!data && !error) {
      unique = true;
    }
  }
  return code;
}
