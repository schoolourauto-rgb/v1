"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { createClient } from "@supabase/supabase-js";
import { parseCarMessage } from "@/lib/carParser";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });



export default function CarPasteGenerate() {
  // New: State for WhatsApp paste input
  const [rawInput, setRawInput] = useState("");
  // New: State for car form fields
  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    version: "",
    year: "",
    fuel: "",
    price: "",
    km: "",
    owner: "",
    insurance: "",
    description: "",
    images: [],
  });
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isClient = typeof window !== "undefined";


  // New: Smart WhatsApp parser and auto-fill
  const handleAutoFill = () => {
    if (!rawInput.trim()) return;

    const text = rawInput;

    const extract = (keywords: string[]) => {
      for (const key of keywords) {
        const regex = new RegExp(
          `${key}\\s*[:\\-]*\\s*(.+)`,
          "i"
        );
        const match = text.match(regex);
        if (match) return match[1].trim();
      }
      return "";
    };

    const make = extract(["Make", "Brand"]);
    const model = extract(["Model"]);
    const version = extract(["Version", "Variant"]);
    const year = extract(["Year"]);
    const fuel = extract(["Fuel"]);
    const owner = extract(["Owner"]);
    const km = extract(["K/m", "Km", "Kilometer"]);
    const insurance = extract(["Insurance"]);
    const priceRaw = extract(["Price"]);

    const cleanPrice = priceRaw
      ? priceRaw.replace(/[₹,/-]/g, "").replace(/\s/g, "")
      : "";

    const cleanKm = km ? km.replace(/[^\d]/g, "") : "";

    const title = `${make} ${model} ${version}`.trim();

    setForm((prev) => ({
      ...prev,
      title: title || prev.title,
      brand: make || prev.brand,
      model: model || prev.model,
      version: version || prev.version,
      year: year || prev.year,
      fuel: fuel || prev.fuel,
      description: text,
      price: cleanPrice || prev.price,
      km: cleanKm || prev.km,
      owner: owner || prev.owner,
      insurance: insurance || prev.insurance,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files].slice(0, 6));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
                <Input name="brand" placeholder="Brand" value={form.brand} readOnly />
                <Input name="model" placeholder="Model" value={form.model} readOnly />
                <Input name="version" placeholder="Version" value={form.version} readOnly />
              </div>
              <div className="flex gap-2">
                <Input name="year" placeholder="Year" value={form.year} readOnly />
                <Input name="fuel" placeholder="Fuel" value={form.fuel} readOnly />
                <Input name="price" placeholder="Price" value={form.price} readOnly />
              </div>
              <div className="flex gap-2">
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
        <Label>Upload Images (max 6)</Label>
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
          {images.length < 6 && (
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
        <div className="text-xs text-muted-foreground">You can upload up to 6 images.</div>
      </div>

      {/* Optional Description */}
      <div className="mb-6">
        <Label>Optional Description</Label>
        <textarea
          className="w-full min-h-[80px] rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground resize-vertical"
          placeholder="Add any extra details (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
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
