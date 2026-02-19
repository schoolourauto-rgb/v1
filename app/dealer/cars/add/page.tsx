
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { FormCard } from "@/components/ui/form-card"
import { FormLabel } from "@/components/ui/form-label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { Button } from "@/components/ui/button"

export default function AddCarPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  type UploadedImage = {
    url: string;
    id: string;
    isPrimary: boolean;
  };
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(false)

  function handleDrop(files: FileList) {
    // Dummy upload logic
    const newImages = Array.from(files).map((file, i) => ({
      url: URL.createObjectURL(file),
      id: `${file.name}-${i}`,
      isPrimary: images.length === 0 && i === 0,
    }))
    setImages((prev) => [...prev, ...newImages])
  }

  function handleRemove(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  function handleSetPrimary(id: string) {
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === id })))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const { data: userData } = await supabase.auth.getUser();
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value || "";
    if (!userData.user) {
      setLoading(false);
      return;
    }
    await supabase.from("cars").insert({
      dealer_id: userData.user.id,
      title: getValue("title"),
      price: getValue("price"),
      brand: getValue("brand"),
      model: getValue("model"),
      year: getValue("year"),
      fuel: getValue("fuel"),
      transmission: getValue("transmission"),
      km_driven: getValue("km"),
      description: getValue("description"),
    });
    setLoading(false);
    router.push("/dealer/cars");
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FormCard>
            <div className="space-y-4">
              <div>
                <FormLabel>Title</FormLabel>
                <Input name="title" placeholder="Car title" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel>Brand</FormLabel>
                  <Input name="brand" placeholder="Brand" required />
                </div>
                <div>
                  <FormLabel>Model</FormLabel>
                  <Input name="model" placeholder="Model" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <FormLabel>Year</FormLabel>
                  <Input name="year" placeholder="Year" required type="number" min={1900} max={2100} />
                </div>
                <div>
                  <FormLabel>Fuel Type</FormLabel>
                  <Select name="fuel" required>
                    <option value="">Select</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </Select>
                </div>
                <div>
                  <FormLabel>Transmission</FormLabel>
                  <Select name="transmission" required>
                    <option value="">Select</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel>KM Driven</FormLabel>
                  <Input name="km" placeholder="KM Driven" required type="number" min={0} />
                </div>
                <div>
                  <FormLabel>Price</FormLabel>
                  <Input name="price" placeholder="Price" required type="number" min={0} />
                </div>
              </div>
              <div>
                <FormLabel>Description</FormLabel>
                <Textarea name="description" placeholder="Describe the car..." rows={5} required />
              </div>
            </div>
          </FormCard>
        </div>
        <div className="space-y-6">
          <FormCard>
            <FormLabel>Car Images</FormLabel>
            <ImageUpload
              images={images}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onSetPrimary={handleSetPrimary}
              loading={loading}
            />
          </FormCard>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Publishing..." : "Publish Car"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
