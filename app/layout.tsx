import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OurAuto – Buy & Sell Cars in India",
  description: "Buy and sell verified used cars from trusted showroom dealers across India. 100% verified inventory, no spam, no fake listings.",
  openGraph: {
    title: "OurAuto – Buy & Sell Cars in India",
    description: "Buy and sell verified used cars from trusted showroom dealers across India. 100% verified inventory, no spam, no fake listings.",
    url: "https://ourauto.in/",
    siteName: "OurAuto",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OurAuto – Buy & Sell Cars in India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://ourauto.in/",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}