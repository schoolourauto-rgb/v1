export const dynamic = "force-dynamic"
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
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
  // Removed unused and unsafe any type


  if (error || !profile) {
    redirect("/");
    return null;
  }

  if (profile.role !== "admin") {
    redirect("/");
    return null;
  }

  return <>{children}</>;
}
