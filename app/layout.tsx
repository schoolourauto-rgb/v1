
export const metadata = {
  title: "Free Marketplace",
  description: "Dealer Inventory Network Platform",
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
            background: linear-gradient(180deg, #000 0%, #18181c 60%, #23232a 100%);
            min-height: 100vh;
            transition: background 0.4s;
            scrollbar-width: thin;
            scrollbar-color: #C9A227 #23232a;
          }
          ::-webkit-scrollbar {
            width: 8px;
            background: #23232a;
          }
          ::-webkit-scrollbar-thumb {
            background: #C9A227;
            border-radius: 8px;
          }
          .container-center {
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .navbar-spaced {
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
          }
          .animate-fadeIn {
            animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </head>
      <body className="bg-white dark:bg-black overflow-x-hidden">
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
