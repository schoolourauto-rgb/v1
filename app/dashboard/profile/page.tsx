"use client"
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DealerProfilePage() {
  // create supabase client instance
  const supabase = createClient();
  const router = useRouter()

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      if (!supabase) {
        setError("Database not configured.")
        setLoading(false)
        return
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const userId = session.user.id;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single()
      if (error) setError(error.message)
      setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      if (!supabase) {
        setError("Database not configured.")
        setSaving(false)
        return
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("User not authenticated.");
        setSaving(false);
        return;
      }
      const userId = session.user.id;
      const { error } = await supabase
        .from("profiles")
        .update({
          dealership_name: profile.dealership_name,
          phone: profile.phone,
          location: profile.location,
        })
        .eq("user_id", userId)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError("Failed to update profile.")
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Profile not found.</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <form onSubmit={handleSave} className="bg-card border border-border p-4 sm:p-6 rounded-xl shadow-sm w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold mb-2">Edit Dealership Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Dealership Name</label>
            <input
              type="text"
              className="w-full p-3 bg-background border border-border rounded-md"
              value={profile.dealership_name || ''}
              onChange={e => setProfile({ ...profile, dealership_name: e.target.value })}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
            <input
              type="tel"
              className="w-full p-3 bg-background border border-border rounded-md"
              value={profile.phone || ''}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
            <input
              type="text"
              className="w-full p-3 bg-background border border-border rounded-md"
              value={profile.location || ''}
              onChange={e => setProfile({ ...profile, location: e.target.value })}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email (read-only)</label>
            <input
              type="email"
              className="w-full p-3 bg-background border border-border rounded-md"
              value={profile.email || ''}
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            {profile.verified ? (
              <span className="inline-block bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Verified</span>
            ) : (
              <span className="inline-block bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold">Not Verified</span>
            )}
            <span className="text-muted-foreground text-xs">Verification status</span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold p-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {error && <div className="bg-danger/10 border border-danger/40 text-danger rounded-2xl p-3 text-sm">{error}</div>}
        {success && <div className="bg-success/10 border border-success/40 text-success rounded-2xl p-3 text-sm">Profile updated successfully!</div>}
      </form>
    </div>
  )
}
