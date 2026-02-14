export const dynamic = "force-dynamic"
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  if (!supabase) {
    redirect("/login");
    return null;
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    redirect("/login");
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();
  const typedProfile: any = profile;

  if (error || !typedProfile) {
    redirect("/");
    return null;
  }

  if (typedProfile.role !== "admin") {
    redirect("/");
    return null;
  }

  return <>{children}</>;
}
