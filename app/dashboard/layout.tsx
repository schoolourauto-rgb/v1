export const dynamic = "force-dynamic"
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    redirect("/");
  }

  if (profile.role !== "dealer" && profile.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
