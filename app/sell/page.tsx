
import dynamic from "next/dynamic";
import { Suspense } from "react";

const AddCarClient = dynamic(() => import("@/components/dealer/AddCarClient"), { ssr: false });

export default function SellPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AddCarClient />
    </Suspense>
  );
}
