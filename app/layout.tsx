export const metadata = {
  title: "Free Marketplace",
  description: "Dealer Inventory Network Platform",
};

import Header from "@/components/layout/Header";
import ThemeProviderClient from "./ThemeProviderClient";
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
        <meta name="theme-color" content="#C9A227" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
        <ThemeProviderClient>
          <Header />
          <LocationPopup />
          <InstallAppPopup />
          {children}
        </ThemeProviderClient>
      </body>
    </html>
  );
}
