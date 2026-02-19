"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { FormCard } from "@/components/ui/form-card"
import { FormLabel } from "@/components/ui/form-label"
import { Input } from "@/components/ui/input"
import { ProfileImageUpload } from "@/components/ui/profile-image-upload"
import { Button } from "@/components/ui/button"

export default function DealerSettingsPage() {
  const [profileImage, setProfileImage] = useState<string>()
  const [loading, setLoading] = useState(false)

  function handleProfileDrop(file: File) {
    setProfileImage(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <FormCard>
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
            <ProfileImageUpload image={profileImage} onDrop={handleProfileDrop} loading={loading} />
            <div className="flex-1">
              <FormLabel>Business Name</FormLabel>
              <Input name="businessName" placeholder="Business Name" required className="mb-4" />
              <FormLabel>Contact Email</FormLabel>
              <Input name="email" placeholder="Email" type="email" required className="mb-4" />
              <FormLabel>Contact Phone</FormLabel>
              <Input name="phone" placeholder="Phone" required />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <FormLabel>Address</FormLabel>
              <Input name="address" placeholder="Address" required />
            </div>
            <div className="flex-1">
              <FormLabel>City</FormLabel>
              <Input name="city" placeholder="City" required />
            </div>
          </div>
          <Button type="submit" className="mt-8 w-full md:w-auto" disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </FormCard>
      </form>
    </DashboardLayout>
  )
}
