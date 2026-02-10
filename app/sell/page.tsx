"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SellPage() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    contact: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    const supabase = createClient();
    if (!user) {
      setStatus("You must be logged in to list a car.");
      return;
    }
    let imageUrl = null;
    try {
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(fileName, image);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData?.publicUrl || null;
      }
      const { data, error } = await supabase.from("cars").insert([
        {
          brand: form.brand,
          model: form.model,
          year: form.year,
          price: form.price,
          contact: form.contact,
          image_url: imageUrl,
          dealer_id: user.id,
        },
      ]);
      if (error) throw error;
      setStatus("Car listed successfully!");
      setForm({ brand: "", model: "", year: "", price: "", contact: "" });
      setImage(null);
    } catch (e) {
      setStatus("Error listing car. Please try again.");
      console.error(e);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">Sell Your Car</h2>
        {status && <div className="mb-4 text-sm text-center text-red-500">{status}</div>}
        {!user && (
          <div className="mb-4 text-sm text-center text-red-500">
            Please log in to list your car.
          </div>
        )}
        <input
          className="mb-2 w-full p-2 border rounded"
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          disabled={!user}
        />
        <input
          className="mb-2 w-full p-2 border rounded"
          name="model"
          placeholder="Model"
          value={form.model}
          onChange={handleChange}
          disabled={!user}
        />
        <input
          className="mb-2 w-full p-2 border rounded"
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          disabled={!user}
        />
        <input
          className="mb-2 w-full p-2 border rounded"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          disabled={!user}
        />
        <input
          className="mb-2 w-full p-2 border rounded"
          name="contact"
          placeholder="Contact"
          value={form.contact}
          onChange={handleChange}
          disabled={!user}
        />
        <input
          type="file"
          accept="image/*"
          className="mb-4 w-full p-2 border rounded"
          onChange={e => setImage(e.target.files?.[0] || null)}
          disabled={!user}
        />
        <button className="bg-yellow-500 w-full py-2 rounded mt-2" type="submit" disabled={!user}>
          List Car
        </button>
      </form>
    </main>
  );
}
