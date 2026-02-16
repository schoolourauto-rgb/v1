

"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface SignupForm {
  business_name: string;
  owner_name: string;
  mobile: string;
  email: string;
  password: string;
  referral_code: string;
  location: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>({
    business_name: "",
    owner_name: "",
    mobile: "",
    email: "",
    password: "",
    referral_code: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Geolocation fetch
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const address = data.display_name || `${latitude},${longitude}`;
          setForm((f) => ({ ...f, location: address }));
          if (locationInputRef.current) locationInputRef.current.value = address;
        } catch {
          setForm((f) => ({ ...f, location: `${latitude},${longitude}` }));
        }
        setGeoLoading(false);
      },
      () => {
        setError("Could not fetch location.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Main signup handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed.");
        setLoading(false);
        return;
      }
      setSuccess("Account created! Redirecting...");
      setLoading(false);
      setTimeout(() => router.push("/dealer/dashboard"), 1200);
    } catch (err: any) {
      setError(err?.message || "Unknown error.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-black to-neutral-800 text-white px-4">
      <form
        className="w-full max-w-md bg-black/80 border border-neutral-800 rounded-2xl shadow-2xl p-8 space-y-6 backdrop-blur-md"
        onSubmit={handleSignup}
        autoComplete="off"
        spellCheck={false}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">Dealer Signup</h1>
          <p className="text-neutral-400 text-sm">Join India’s Verified Car Marketplace</p>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl p-3 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/40 text-green-400 rounded-xl p-3 text-sm text-center">{success}</div>
        )}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Business Name"
            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-white placeholder:text-neutral-500 transition"
            value={form.business_name}
            onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))}
            required
            autoFocus
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-white placeholder:text-neutral-500 transition"
            value={form.owner_name}
            onChange={e => setForm(f => ({ ...f, owner_name: e.target.value }))}
            required
            disabled={loading}
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-white placeholder:text-neutral-500 transition"
            value={form.mobile}
            onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
            pattern="[0-9]{10,15}"
            required
            disabled={loading}
            inputMode="tel"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-white placeholder:text-neutral-500 transition"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            disabled={loading}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-white placeholder:text-neutral-500 transition"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            minLength={6}
            disabled={loading}
            autoComplete="new-password"
          />
          <input
            type="text"
            placeholder="Referral Code (optional)"
            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-white placeholder:text-neutral-500 transition uppercase"
            value={form.referral_code}
            onChange={e => setForm(f => ({ ...f, referral_code: e.target.value.toUpperCase() }))}
            maxLength={8}
            disabled={loading}
            style={{ textTransform: 'uppercase' }}
            autoCapitalize="characters"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Business Location (auto fetch or edit)"
              className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-white placeholder:text-neutral-500 transition"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              ref={locationInputRef}
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="button"
              className="shrink-0 px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={fetchLocation}
              disabled={geoLoading || loading}
              aria-label="Auto fetch location"
              title="Auto fetch location"
            >
              {geoLoading ? '...' : '📍'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 hover:opacity-90 text-black font-bold p-3 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-yellow-400/40 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? 'Creating Account…' : 'Create Account'}
        </button>
        <p className="text-center text-neutral-400 text-sm">
          Already have an account?{' '}
          <a href="/auth/login" className="text-yellow-400 hover:underline font-semibold">Login</a>
        </p>
      </form>
    </div>
  );
}
