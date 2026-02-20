
import dynamic from "next/dynamic";
import { Suspense } from "react";

const AddCarClient = dynamic(() => import("@/components/dealer/AddCarClient"), { ssr: false });

export const metadata = {
  title: "Sell Your Car – OurAuto",
  description: "List your car with OurAuto and reach verified buyers instantly.",
  openGraph: {
    title: "Sell Your Car – OurAuto",
    description: "List your car with OurAuto and reach verified buyers instantly.",
    url: "https://ourauto.in/sell",
    siteName: "OurAuto",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sell Your Car – OurAuto",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://ourauto.in/sell",
  },
};

export default function SellPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AddCarClient />
    </Suspense>
  );
}
