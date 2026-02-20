"use client";
import { useEffect, useState } from "react";
import CarPreviewModal from "./CarPreviewModal";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

const carSchema = z.object({
  title: z.string().min(2),
  price: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.string().min(4),
  fuel: z.string().min(1),
  transmission: z.string().min(1),
  description: z.string().optional(),
  phone: z.string().min(8),
  images: z.array(z.any()).optional(),
});

export default function AddCarClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);
  const [form, setForm] = useState<{
    title: string;
    price: string;
    brand: string;
    model: string;
    year: string;
    fuel: string;
    transmission: string;
    description: string;
    phone: string;
    images: File[];
  }>({
    title: "",
    price: "",
    brand: "",
    model: "",
    year: "",
    fuel: "",
    transmission: "",
    description: "",
    phone: "",
    images: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return <div className="p-8 text-center">Please log in to add a car.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files].slice(0, 10) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      carSchema.parse(form);
      setShowPreview(true);
    } catch (err) {
      setError("Please fill all required fields correctly.");
    }
  };

  const handlePublish = async (previewData: any) => {
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      Object.entries({ ...form, ...previewData }).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file: File) => formData.append("images", file));
        } else {
          formData.append(key, value as string);
        }
      });
      // Add a dummy reCAPTCHA token for now (replace with real if needed)
      formData.append("token", "dummy-token");
      const res = await fetch("/api/car", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create car");
      setShowPreview(false);
      router.push("/dealer/dashboard");
    } catch (err) {
      setError("Failed to publish car. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Car</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" required />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="w-full p-2 border rounded" required />
        <input name="model" value={form.model} onChange={handleChange} placeholder="Model" className="w-full p-2 border rounded" required />
        <input name="year" value={form.year} onChange={handleChange} placeholder="Year" className="w-full p-2 border rounded" required />
        <input name="fuel" value={form.fuel} onChange={handleChange} placeholder="Fuel" className="w-full p-2 border rounded" required />
        <input name="transmission" value={form.transmission} onChange={handleChange} placeholder="Transmission" className="w-full p-2 border rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" required />
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-yellow-500 text-black px-6 py-2 rounded font-semibold" disabled={submitting}>Preview</button>
      </form>
      {showPreview && (
        <CarPreviewModal
          onClose={() => setShowPreview(false)}
          onPublish={handlePublish}
        />
      )}
    </div>
  );
}
