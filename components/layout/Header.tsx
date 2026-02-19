
"use client"


"use client"


import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { createClient } from "@/lib/supabase/client";
import Logo from '@/components/Logo';

type Session = {
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  } | null;
};

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [dealerName, setDealerName] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    let authListener: any;

    async function getSessionAndDealer() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user?.id) {
        // Fetch dealer name if logged in
        const { data } = await supabase
          .from("dealers")
          .select("name")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setDealerName(data?.name || null);
      } else {
        setDealerName(null);
      }
    }

    getSessionAndDealer();

    authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        supabase
          .from("dealers")
          .select("name")
          .eq("user_id", session.user.id)
          .maybeSingle()
          .then(({ data }) => setDealerName(data?.name || null));
      } else {
        setDealerName(null);
      }
    });

    return () => {
      if (authListener && typeof authListener.subscription?.unsubscribe === "function") {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Only render theme toggle after mount to avoid hydration mismatch

  return (
    <header className="border-b soft-border bg-background sticky top-0 z-30 transition-colors duration-200 rounded-b-2xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center" aria-label="Home">
          <div style={{ width: 140, height: "auto" }}>
            {/* Logo: theme-aware */}
            <Logo />
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-foreground hover:text-accent transition-colors duration-200 text-xl p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}
          {session && session.user ? (
            <>
              <span className="text-foreground text-sm font-medium px-3 py-1 rounded-2xl">
                {dealerName ? dealerName : "My Account"}
              </span>
              <button
                className="text-foreground hover:text-accent transition-colors duration-200 text-sm font-medium px-3 py-1 rounded-2xl soft-border"
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-foreground hover:text-accent transition-colors duration-200 text-sm font-medium px-3 py-1 rounded-2xl"
            >
              Dealer Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
