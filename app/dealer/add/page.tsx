
"use client";
import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";

const initialForm = {
  brand: "",
  model: "",
  year: "",
  price: "",
  fuel: "",
  transmission: "",
  description: "",
};

export default function AddCarPage() {
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  // Remove image
  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setImages((prev) => [...prev, ...files]);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();


  // Compress image before upload
  async function compressImage(file: File) {
    const options = {
      maxSizeMB: 0.4,           // 400 KB target
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: "image/webp",
    };
    return await imageCompression(file, options);
  }

  // Handle form submit (with compression)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Compress all images before upload
    let compressedFiles: File[] = [];
    try {
      compressedFiles = await Promise.all(images.map(file => compressImage(file)));
    } catch (err) {
      setLoading(false);
      alert("Image compression failed. Please try again.");
      return;
    }

    // TODO: Upload compressedFiles to Supabase Storage and save car data
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm(initialForm);
      setImages([]);
    }, 1500);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl mx-auto mt-6 shadow-sm">
      <h1 className="text-2xl font-extrabold mb-8 text-yellow-400">Add New Car</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="brand" value={form.brand} onChange={handleChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none transition" placeholder="Brand" />
          <input name="model" value={form.model} onChange={handleChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none transition" placeholder="Model" />
          <input name="year" value={form.year} onChange={handleChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none transition" placeholder="Year" />
          <input name="price" value={form.price} onChange={handleChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none transition" placeholder="Price" />
          <input name="fuel" value={form.fuel} onChange={handleChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none transition" placeholder="Fuel Type" />
          <input name="transmission" value={form.transmission} onChange={handleChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none transition" placeholder="Transmission" />
        </div>
        <textarea name="description" value={form.description} onChange={handleChange} required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none transition min-h-[100px]" placeholder="Description" />

        {/* Image upload */}
        <div>
          <label className="block font-semibold mb-2 text-zinc-200">Car Images</label>
          <div
            className="border-2 border-dashed border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center bg-zinc-950 hover:bg-zinc-900 transition cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <span className="text-zinc-400 mb-2">Drag & drop or click to select images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          {/* Preview grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-xl border border-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Add Car"}
        </button>
        {success && (
          <div className="text-green-500 font-semibold text-center mt-2">Car added successfully!</div>
        )}
      </form>
    </div>
  );
}