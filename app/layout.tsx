import Header from "@/components/layout/Header";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Header />
        <main className="flex-1 flex flex-col">
        {children}
        </main>
      </body>
    </html>
  );
}
