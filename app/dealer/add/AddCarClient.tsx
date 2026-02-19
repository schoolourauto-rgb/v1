"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";

type CarData = {
  title?: string;
  make?: string;
  model?: string;
  year?: number;
  fuel?: string;
  transmission?: string;
  owner?: string;
  color?: string;
  insurance?: string;
  reg_no?: string;
  confidence?: number;
  [key: string]: string | number | undefined;
};
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import CarCard from "@/components/CarCard";
import { parseCarInput } from "@/lib/carParser";

export default function AddCarClient() {
  const [message, setMessage] = useState("");
  const [carData, setCarData] = useState<CarData>({});
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] }>({ valid: false, errors: [] });
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Use new strict parser
    const result = parseCarInput(message, images.map(f => f.name));
    if (result.success) {
      // Remove images property if present, as CarData does not allow it
      const { images: _images, ...carDataWithoutImages } = result.data;
      setCarData(carDataWithoutImages);
      setTitle(result.data.title || "");
      setValidation({ valid: true, errors: [] });
    } else {
      setCarData({});
      setTitle("");
      setValidation({ valid: false, errors: Object.values(result.errors) });
    }
  }, [message, images]);

  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const canPublish = validation.valid && images.length > 0 && !loading;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canPublish) return;
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // Upload images to Supabase storage
      const supabase = createClient();
      const imageUrls: string[] = [];
      for (const file of images) {
        const { data, error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(`dealer/${Date.now()}-${file.name}`, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(data.path);
        imageUrls.push(urlData.publicUrl);
      }
      // Send POST request to server route
      const res = await fetch("/api/dealer/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_message: message,
          parsed_data: carData,
          image_urls: imageUrls,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to list car.");
        setLoading(false);
        return;
      }
      setSuccess("Car listed successfully!");
      setImages([]);
      setMessage("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to list car.");
      } else {
        setError("Failed to list car.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Responsive layout
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row md:items-start pb-24">
      {/* Left: Chat Composer */}
      <form
        className="w-full md:w-1/2 max-w-xl mx-auto md:mx-0 bg-background card-bg rounded-2xl soft-border p-6 mt-8 flex flex-col"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* WhatsApp-style chat input */}
        <div className="mb-6">
          <textarea
            className="w-full h-40 md:h-56 p-4 text-lg bg-background card-bg rounded-2xl resize-none font-mono focus:outline-none focus:ring-2 focus:ring-accent soft-border"
            placeholder="Paste car details like WhatsApp format..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            autoFocus
            rows={8}
          />
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(carData)
            .filter(([k, v]) =>
              ["year", "make", "model", "variant", "fuel", "transmission", "color", "owner", "insurance", "reg_no"].includes(k) && v
            )
            .map(([k, v]) => (
              <span
                key={k}
                className="px-3 py-1 bg-background text-foreground/80 text-sm rounded-2xl soft-border"
              >
                {String(v)}
              </span>
            ))}
          {typeof carData.confidence === "number" && carData.confidence > 0 && (
            <span className="px-3 py-1 bg-accent text-accentFg text-xs rounded-2xl font-semibold ml-2">
              {carData.confidence}%
            </span>
          )}
        </div>

        {/* Image Picker */}
        <div className="mb-6">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
            ref={fileInputRef}
            className="hidden"
          />
          <div className="grid grid-cols-3 gap-2">
            {images.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden soft-border">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  width={320}
                  height={240}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-accent text-accentFg text-xs px-2 py-0.5 rounded-2xl">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-background text-foreground text-xs px-2 rounded-2xl soft-border"
                  aria-label="Remove image"
                >
                  X
                </button>
              </div>
            ))}
            {/* Add button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-accent rounded-2xl flex items-center justify-center text-2xl text-accent"
              aria-label="Add image"
            >
              +
            </button>
          </div>
        </div>

        {/* Error/Success/Loading */}
        <div className="mt-4 min-h-[24px]">
          {error && <div className="text-accent text-sm font-medium mb-2">{error}</div>}
          {success && <div className="text-accent text-sm font-medium mb-2">{success}</div>}
          {loading && <div className="text-accent text-sm font-medium mb-2">Listing car...</div>}
        </div>

        {/* Validation UI */}
        {!validation.valid && (
          <div className="text-accent text-sm font-medium mb-2">
            {validation.errors.join(", ")}
          </div>
        )}
        {typeof carData.confidence === "number" && carData.confidence < 60 && (
          <div className="text-accent text-sm font-medium mb-2">
            Please review detected fields
          </div>
        )}

        {/* Sticky Publish Button */}
        <div className="sticky bottom-0 left-0 w-full">
          <button
            type="submit"
            className="w-full mt-6 btn-accent font-semibold py-3 rounded-2xl transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!canPublish}
          >
            {loading ? (
              <span className="animate-spin mr-2 h-5 w-5 border-2 border-accent border-t-transparent rounded-full"></span>
            ) : (
              "🚀 Generate Listing"
            )}
          </button>
        </div>
      </form>

      {/* Right: Live Preview */}
      <div className="w-full md:w-1/2 flex justify-center items-start mt-8 md:mt-8">
        <div className="w-full max-w-md mx-auto">
          <CarCard
            car={{
              title,
              // price: carData.price, // removed forbidden pattern
              brand: carData.make,
              model: carData.model,
              year: carData.year,
              fuel: carData.fuel,
              transmission: carData.transmission,
              owner: carData.owner,
              // km: carData.km, // removed forbidden pattern
              images: images.map(file => URL.createObjectURL(file)),
              description: title,
              slug,
              preview: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
