import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Free Marketplace",
  description: "Dealer Network Platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}