"use client";

import { useState, useMemo } from "react";
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
  const [paste, setPaste] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isClient = typeof window !== "undefined";

  // Smart parse WhatsApp message
  const parsed = useMemo(() => parseCarMessage(paste), [paste]);

  // Only extract required fields for auto-fill
  const autoFields = {
    year: parsed.year && parsed.year >= 2000 ? parsed.year : "",
    mileage: parsed.km || "",
    insurance:
      /\b(tp|third)\b/i.test(paste)
        ? "THIRD PARTY"
        : /\bfull\b/i.test(paste)
        ? "FULL"
        : /\b(nil|expired)\b/i.test(paste)
        ? "NIL"
        : "",
    transmission: /auto/i.test(paste)
      ? "Automatic"
      : /manual/i.test(paste)
      ? "Manual"
      : "",
    fuel:
      /petrol/i.test(paste)
        ? "Petrol"
        : /diesel/i.test(paste)
        ? "Diesel"
        : /cng/i.test(paste)
        ? "CNG"
        : /electric/i.test(paste)
        ? "Electric"
        : "",
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
    formData.set("year", autoFields.year ? String(autoFields.year) : "");
    formData.set("mileage", autoFields.mileage ? String(autoFields.mileage) : "");
    formData.set("insurance", autoFields.insurance);
    formData.set("transmission", autoFields.transmission);
    formData.set("fuel_type", autoFields.fuel);
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
    setPaste("");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Left: WhatsApp Paste */}
        <div>
          <Label>Paste WhatsApp Car Details</Label>
          <textarea
            className="w-full min-h-[140px] rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground resize-vertical"
            placeholder="Paste car details from WhatsApp..."
            value={paste}
            onChange={e => setPaste(e.target.value)}
            required
          />
        </div>
        {/* Right: Live Preview */}
        <div>
          <Label>Live Preview</Label>
          <Card>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  name="year"
                  placeholder="Year"
                  value={autoFields.year}
                  readOnly
                />
                <Input
                  name="mileage"
                  placeholder="Mileage"
                  value={autoFields.mileage}
                  readOnly
                />
              </div>
              <div className="flex gap-2">
                <Input
                  name="insurance"
                  placeholder="Insurance"
                  value={autoFields.insurance}
                  readOnly
                />
                <Input
                  name="transmission"
                  placeholder="Transmission"
                  value={autoFields.transmission}
                  readOnly
                />
              </div>
              <Input
                name="fuel_type"
                placeholder="Fuel Type"
                value={autoFields.fuel}
                readOnly
              />
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
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 group-hover:opacity-100"
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
