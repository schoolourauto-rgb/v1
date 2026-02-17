

import DealerSidebar from "./DealerSidebar";


export const dynamic = "force-dynamic";


export default function DealerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <DealerSidebar />
      <main className="flex-1 p-8 bg-black">{children}</main>
    </div>
  );
}
