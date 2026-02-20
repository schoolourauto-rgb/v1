import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dealer Login – OurAuto",
  description: "Login for verified showroom dealers to manage inventory and leads.",
  openGraph: {
    title: "Dealer Login – OurAuto",
    description: "Login for verified showroom dealers to manage inventory and leads.",
    url: "https://ourauto.in/dealer-login",
    siteName: "OurAuto",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dealer Login – OurAuto",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://ourauto.in/dealer-login",
  },
};

import DealerLoginClient from "./DealerLoginClient";

export default function DealerLoginPage() {
  return <DealerLoginClient />;
}
