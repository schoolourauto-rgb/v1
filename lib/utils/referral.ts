import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

// Generate a unique referral code (alphanumeric, 8 chars)
export function generateReferralCode(): string {
  return randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();
}

// Ensure user has a referral code, else generate and update
export async function ensureReferralCode(userId: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('referral_code').eq('id', userId).single();
  if (!profile?.referral_code) {
    let code = generateReferralCode();
    // Ensure uniqueness
    let exists = true;
    while (exists) {
      const { data: existing } = await supabase.from('profiles').select('id').eq('referral_code', code).maybeSingle();
      if (!existing) exists = false;
      else code = generateReferralCode();
    }
    await supabase.from('profiles').update({ referral_code: code }).eq('id', userId);
    return code;
  }
  return profile.referral_code;
}
