


import { createClient } from '@/lib/supabase/server';

export default function LocationLandingPage() {
  const supabase = createClient();
  if (!supabase) {
    return <div>Service temporarily unavailable</div>;
  }
  return <div className="p-10 text-center">Slug page working</div>;
}
