"use client";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CarPasteGenerate() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files.slice(0, 6)); // max 6
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      alert("Please verify CAPTCHA");
      return;
    }

    setLoading(true);

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
    formData.append("token", token);
    formData.append("images", JSON.stringify(uploadedUrls));

    const res = await fetch("/api/car", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    recaptchaRef.current?.reset();

    if (!res.ok) {
      alert("Submission failed");
      return;
    }

    alert("Car added successfully 🚗");
    e.currentTarget.reset();
    setImages([]);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="title" placeholder="Title" className="w-full border p-2" />
        <input name="brand" placeholder="Brand" className="w-full border p-2" />
        <input name="model" placeholder="Model" className="w-full border p-2" />
        <input name="year" placeholder="Year" className="w-full border p-2" />
        <input name="price" placeholder="Price" className="w-full border p-2" />
        <input name="fuel_type" placeholder="Fuel Type" className="w-full border p-2" />
        <input name="transmission" placeholder="Transmission" className="w-full border p-2" />
        <input name="mileage" placeholder="Mileage" className="w-full border p-2" />

        {/* Image Upload */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {/* Preview */}
        <div className="flex gap-2 flex-wrap">
          {images.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          ref={recaptchaRef}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2"
        >
          {loading ? "Submitting..." : "Add Car"}
        </button>

      </form>
    </div>
  );
}
