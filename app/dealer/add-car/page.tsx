"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCarPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    km_driven: "",
    city: "",
    fuel_type: "",
    transmission: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Validate required fields
    if (!form.title || !form.brand || !form.model || !form.year || !form.price) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      km_driven: form.km_driven ? Number(form.km_driven) : undefined,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    const res = await fetch("/api/dealer/cars", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      router.push("/dealer/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add car");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Car</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title*" className="w-full p-2 border rounded" required />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand*" className="w-full p-2 border rounded" required />
        <input name="model" value={form.model} onChange={handleChange} placeholder="Model*" className="w-full p-2 border rounded" required />
        <input name="year" value={form.year} onChange={handleChange} placeholder="Year*" className="w-full p-2 border rounded" required type="number" min="2000" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price*" className="w-full p-2 border rounded" required type="number" min="1" />
        <input name="km_driven" value={form.km_driven} onChange={handleChange} placeholder="KM Driven" className="w-full p-2 border rounded" type="number" min="0" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded" />
        <input name="fuel_type" value={form.fuel_type} onChange={handleChange} placeholder="Fuel Type" className="w-full p-2 border rounded" />
        <input name="transmission" value={form.transmission} onChange={handleChange} placeholder="Transmission" className="w-full p-2 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-yellow-500 text-black font-semibold py-2 rounded" disabled={loading}>
          {loading ? "Adding..." : "Add Car"}
        </button>
      </form>
    </div>
  );
}
        <CarPasteGenerate />
