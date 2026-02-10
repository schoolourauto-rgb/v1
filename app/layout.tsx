
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
