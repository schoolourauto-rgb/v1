export const metadata = {
  title: "OurAuto",
  description: "Buy & Sell Cars Easily",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
        <link rel="icon" href="/favicon.png" sizes="32x32" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
            <LocationPopup />
            <InstallAppPopup />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
