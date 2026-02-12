export const metadata = {
  metadataBase: new URL("https://ourauto.in"),
  title: {
    default: "OurAuto | Buy & Sell Cars",
    template: "%s | OurAuto",
  },
  description: "Find the best new and used cars across India.",
  openGraph: {
    type: "website",
    url: "https://ourauto.in",
    title: "OurAuto | Buy & Sell Cars",
    description: "Explore cars, dealers, and listings on OurAuto.",
    siteName: "OurAuto",
  },
  twitter: {
    card: "summary_large_image",
    title: "OurAuto | Buy & Sell Cars",
    description: "Explore cars, dealers, and listings on OurAuto.",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme-provider";
import LocationPopup from "@/components/LocationPopup";
import InstallAppPopup from "@/components/InstallAppPopup";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C9A227" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
        <ThemeProvider>
          <Header />
          <LocationPopup />
          <InstallAppPopup />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
