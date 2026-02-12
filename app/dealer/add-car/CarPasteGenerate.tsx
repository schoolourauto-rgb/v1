"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { createClient } from "@supabase/supabase-js";

import { generateTitleFromDescription, generateCarTitle } from "@/lib/generateCarTitle";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });



export default function CarPasteGenerate() {
  // New: State for WhatsApp paste input
  const [rawInput, setRawInput] = useState("");
  // New: State for car form fields
  type CarForm = {
    title: string;
    make: string;
    model: string;
    version: string;
    year: string;
    fuel: string;
    transmission: string;
    price: string;
    km: string;
    owner: string;
    insurance: string;
    colour: string;
    description: string;
    images: File[];
  };

  const [form, setForm] = useState<CarForm>({
    title: "",
    make: "",
    model: "",
    version: "",
    year: "",
    fuel: "",
    transmission: "",
    price: "",
    km: "",
    owner: "",
    insurance: "",
    colour: "",
    description: "",
    images: [],
  });
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isClient = typeof window !== "undefined";


  // Senior dev: full auto extraction from description
  const handleDescriptionChange = (value: string) => {
    setDescription(value);

    // Extract fields
    const extract = (label: string, regex: RegExp) => value.match(regex)?.[1]?.trim() || "";
    const year = extract("Year", /Year\s*[:-]\s*(\d{4})/i);
    const make = extract("Make", /Make\s*[:-]\s*(.*)/i);
    const model = extract("Model", /Model\s*[:-]\s*(.*)/i);
    const version = extract("Version", /Version\s*[:-]\s*(.*)/i);
    const fuel = extract("Fuel", /Fuel\s*[:-]\s*(.*)/i);
    const transmission = extract("Transmission", /Transmission\s*[:-]\s*(.*)/i);
    const priceRaw = extract("Price", /Price\s*[:-]\s*([\d,]+)/i);
    const kmRaw = extract("KM", /KM\s*[:-]\s*([\d,]+)/i) || extract("K/m", /K\/m\s*[:-]\s*([\d,]+)/i);
    const owner = extract("Owner", /Owner\s*[:-]\s*(.*)/i);
    const colour = extract("Colour", /Colour\s*[:-]\s*(.*)/i);
    const insurance = extract("Insurance", /Insurance\s*[:-]\s*(.*)/i);

    const cleanPrice = priceRaw ? priceRaw.replace(/,/g, "") : "";
    const cleanKm = kmRaw ? kmRaw.replace(/,/g, "") : "";

    // Auto Title
    const autoTitle = generateCarTitle({ year, make, model, version, fuel, transmission });

    setForm((prev) => ({
      ...prev,
      title: autoTitle,
      make,
      model,
      version,
      year,
      fuel,
      transmission,
      price: cleanPrice,
      km: cleanKm,
      owner,
      colour,
      insurance,
      description: value,
    }));
  };

  // Senior dev: instant preview, removal, max 10
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages((prev) => {
      const newImages = [...prev, ...files].slice(0, 10);
      setForm(f => ({ ...f, images: newImages }));
      return newImages;
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      setForm(f => ({ ...f, images: newImages }));
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!siteKey) {
      alert("reCAPTCHA site key missing. Please contact support.");
      setLoading(false);
      return;
    }
    if (!captchaToken) {
      alert("Please verify CAPTCHA");
      setLoading(false);
      return;
    }

    // Upload images
    const uploadedUrls: string[] = [];
    for (const file of images) {
      const filePath = `cars/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("car-images")
        .upload(filePath, file);
      if (error) {
        alert("Image upload failed");
        setLoading(false);
        return;
      }
      const { data } = supabase.storage
        .from("car-images")
        .getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }

    const formData = new FormData(e.currentTarget);
    formData.set("year", form.year ? String(form.year) : "");
    formData.set("mileage", form.km ? String(form.km) : "");
    formData.set("insurance", form.insurance);
    formData.set("transmission", form.version); // Adjust if you have a transmission field
    formData.set("fuel_type", form.fuel);
    formData.set("description", description);
    formData.append("token", captchaToken);
    formData.append("images", JSON.stringify(uploadedUrls));

    const res = await fetch("/api/car", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    setCaptchaToken(null);

    if (!res.ok) {
      alert("Submission failed");
      return;
    }

    alert("Car added successfully 🚗");
    setRawInput("");
    setDescription("");
    setImages([]);
    // @ts-expect-error: grecaptcha is injected by reCAPTCHA script
    if (typeof window !== 'undefined' && window.grecaptcha && window.grecaptcha.reset) window.grecaptcha.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col min-h-[80vh]"
      autoComplete="off"
    >
      {/* Premium Auto-Fill UI (Below Images) */}
      <div className="mt-6 space-y-3">
        <label className="text-sm font-medium text-muted-foreground">
          Paste WhatsApp Vehicle Details
        </label>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="Paste full vehicle details here..."
          className="w-full h-36 rounded-xl bg-card border border-border p-4 text-sm resize-none"
        />
        <button
          type="button"
          onClick={handleAutoFill}
          className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-xl hover:opacity-90"
        >
          Auto Detect & Fill
        </button>
      </div>

      {/* Live Preview of Auto-Filled Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <Label>Auto-Filled Car Details</Label>
          <Card>
            <div className="space-y-2">
              <Input name="title" placeholder="Title" value={form.title} readOnly />
              <div className="flex gap-2">
                <Input name="make" placeholder="Make" value={form.make} readOnly />
                <Input name="model" placeholder="Model" value={form.model} readOnly />
                <Input name="version" placeholder="Version" value={form.version} readOnly />
                <Input name="year" placeholder="Year" value={form.year} readOnly />
                <Input name="fuel" placeholder="Fuel" value={form.fuel} readOnly />
                <Input name="transmission" placeholder="Transmission" value={form.transmission} readOnly />
                <Input name="colour" placeholder="Colour" value={form.colour} readOnly />
              </div>
              <div className="flex gap-2">
                <Input name="price" placeholder="Price" value={form.price} readOnly />
                <Input name="km" placeholder="KM" value={form.km} readOnly />
                <Input name="owner" placeholder="Owner" value={form.owner} readOnly />
                <Input name="insurance" placeholder="Insurance" value={form.insurance} readOnly />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Image Upload Grid */}
      <div className="mb-6">
        <Label>Upload Images (max 10)</Label>
        <div className="flex flex-wrap gap-3 mb-2">
          {images.map((file, idx) => (
            <div key={idx} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                className="w-24 h-24 object-cover rounded-lg border border-border shadow"
                alt="preview"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-90 transition-all duration-200"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
          {images.length < 10 && (
            <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/30 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
                aria-label="Add images"
              />
              <span className="text-2xl text-muted-foreground">+</span>
            </label>
          )}
        </div>
        <div className="text-xs text-muted-foreground">You can upload up to 10 images.</div>
      </div>

      {/* Optional Description */}
      <div className="mb-6">
        <Label>Optional Description</Label>
        <textarea
          className="w-full min-h-[80px] rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground resize-vertical"
          placeholder="Add any extra details (optional)"
          value={description}
          onChange={e => handleDescriptionChange(e.target.value)}
          name="description"
        />
      </div>

      {/* reCAPTCHA */}
      <div className="mb-6">
        {isClient && siteKey ? (
          <ReCAPTCHA
            sitekey={siteKey}
            onChange={token => setCaptchaToken(token)}
          />
        ) : (
          <div className="text-red-500 text-sm">reCAPTCHA unavailable. Please contact support.</div>
        )}
      </div>

      {/* Sticky Submit Button */}
      <div className="sticky bottom-0 left-0 w-full bg-background/80 py-4 flex justify-end border-t border-border z-10">
        <Button
          type="submit"
          disabled={loading || !captchaToken}
          className="w-full md:w-auto"
        >
          {loading ? "Submitting..." : "Add Car"}
        </Button>
      </div>
    </form>
  );
}
