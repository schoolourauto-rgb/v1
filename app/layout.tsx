


export const metadata = {
  title: "Free Marketplace",
  description: "Dealer Inventory Network Platform",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};


import Header from "@/components/layout/Header";
import ActivityTicker from "@/components/ActivityTicker";
import PopupQueueController from "@/components/PopupQueueController";
import MobileNav from "@/components/layout/MobileNav";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#C9A227" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <style>{`
          body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            transition: background 0.4s;
            scrollbar-width: thin;
            scrollbar-color: rgb(var(--accent)) rgb(var(--background));
          }
          ::-webkit-scrollbar {
            width: 8px;
            background: rgb(var(--background));
          }
          ::-webkit-scrollbar-thumb {
            background: rgb(var(--accent));
            border-radius: 8px;
          }
        `}</style>
      </head>
      <body className="bg-background text-foreground overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ActivityTicker />
          <Header />
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
