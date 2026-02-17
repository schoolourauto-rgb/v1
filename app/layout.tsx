export const metadata = {
  title: "Free Marketplace",
  description: "Dealer Inventory Network Platform",
};



import Header from "@/components/layout/Header";
import PopupQueueController from "@/components/PopupQueueController";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
      <body className="bg-white dark:bg-black text-black dark:text-white min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header />
          <PopupQueueController />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
