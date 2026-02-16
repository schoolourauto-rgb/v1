"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordClient() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  // create supabase client instance

  const handleReset = async () => {
    setLoading(true)

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert("Password updated successfully")
    router.push("/login")
  }

  return (
    <div className="max-w-md mx-auto py-24">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

      <input
        type="password"
        placeholder="New password"
        className="w-full border p-3 rounded mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleReset}
        disabled={loading}
        className="w-full bg-yellow-500 p-3 rounded font-semibold"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </div>
  )
}
