export const metadata = {
  title: "OurAuto",
  description: "Find and list verified cars across India.",
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
        <meta name="theme-color" content="#000000" />
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
