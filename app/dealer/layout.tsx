
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { onboardDealer } from "@/lib/dealer/onboardDealer";
import { getServerUser } from "@/lib/supabase/getServerUser";

export default async function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side: ensure dealer exists for logged-in user
  const user = await getServerUser();
  if (user) {
    await onboardDealer(user.id);
  }
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
