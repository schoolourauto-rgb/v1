import { createClient } from "@/lib/supabase/client";

export default async function DealerProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <div className="mb-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg space-y-6">
        <h1 className="text-xl font-semibold mb-4">Profile</h1>
        <p>Email: {user?.email || "-"}</p>
      </div>
    </div>
  );
}