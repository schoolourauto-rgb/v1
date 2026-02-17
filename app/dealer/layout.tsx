
export const dynamic = "force-dynamic"


import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { onboardDealer } from "@/lib/dealer/onboardDealer";
import { getServerUser } from "@/lib/supabase/getServerUser";
import { redirect } from "next/navigation";

export default async function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    user = await getServerUser();
    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Authentication Error</h2>
            <p>Could not authenticate. Please <a href="/login" className="underline">login</a> again.</p>
          </div>
        </div>
      );
    }
    try {
      await onboardDealer(user.id);
    } catch (err) {
      console.error("Dealer onboarding failed", err);
      // Optionally show fallback UI or continue
    }
  } catch (err) {
    console.error("Dealer layout auth error", err);
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Error</h2>
          <p>Could not authenticate. Please <a href="/login" className="underline">login</a> again.</p>
        </div>
      </div>
    );
  }
  return (
    <body className="bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </body>
  );
}
