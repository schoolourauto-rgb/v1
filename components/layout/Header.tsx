
"use client"


"use client"


import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";

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

  if (!mounted) return null;

  return (
    <header className="border-b border-yellow-500 bg-white dark:bg-black sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <Link
          href="/"
          className="font-bold tracking-wide text-black dark:text-white"
        >
          FREE MARKETPLACE
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-200 text-xl p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {session && session.user ? (
            <>
              <span className="text-black dark:text-white text-sm font-medium px-3 py-1 rounded-lg">
                {dealerName ? dealerName : "My Account"}
              </span>
              <button
                className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-200 text-sm font-medium px-3 py-1 rounded-lg border"
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
              className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-200 text-sm font-medium px-3 py-1 rounded-lg"
            >
              Dealer Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
