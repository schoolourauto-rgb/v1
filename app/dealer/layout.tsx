

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DealerLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      // Log error, but only redirect if unauthenticated
      console.error("Supabase getUser error:", error.message);
    }

    if (!data?.user) {
      redirect("/dealer-login");
    }

    return <>{children}</>;
  } catch (err) {
    // Log error, do not redirect unless unauthenticated
    console.error("DealerLayout crash:", err);
    return null;
  }
}
