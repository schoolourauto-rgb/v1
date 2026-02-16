export const metadata = {
  title: "Free Marketplace",
  description: "Dealer Inventory Network Platform",
};


import Header from "@/components/layout/Header";
import PopupQueueController from "@/components/PopupQueueController";
import { ThemeProvider } from "next-themes";
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header />
          <PopupQueueController />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
