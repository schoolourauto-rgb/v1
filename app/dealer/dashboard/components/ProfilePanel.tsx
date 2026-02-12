import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface ProfilePanelProps {
  profile: any;
  onSave: (data: any) => Promise<void>;
}

export default function ProfilePanel({ profile, onSave }: ProfilePanelProps) {
  const [form, setForm] = useState({
    business_name: profile?.business_name || "",
    owner_name: profile?.owner_name || "",
    mobile: profile?.mobile || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    toast.success("Profile updated successfully.");
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 max-w-xl mx-auto shadow-sm hover:shadow-md transition-shadow duration-200">
      <h2 className="text-2xl font-semibold tracking-tight mb-6">Edit Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-primary dark:text-white">Business Name</label>
          <Input
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-primary dark:text-white">Owner Name</label>
          <Input
            name="owner_name"
            value={form.owner_name}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-primary dark:text-white">Mobile</label>
          <Input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
        <Button
          className="mt-6 w-full"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
