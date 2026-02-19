

import DealerSidebar from "@/components/dealer/DealerSidebar";

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  import { redirect } from "next/navigation"
  import { createServerClient } from "@/lib/supabase/server"
  import Sidebar from "@/components/dealer/Sidebar"
  import Topbar from "@/components/dealer/Topbar"

  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>

  )
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
