export const metadata = {
  title: "Free Marketplace",
  description: "Dealer Inventory Network Platform",
};


import Header from "@/components/layout/Header";
import PopupQueueController from "@/components/PopupQueueController";
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
      <body className="min-h-screen bg-black text-white antialiased">
        <Header />
        <PopupQueueController />
        {children}
      </body>
    </html>
  );
}
