"use client";

import React, { useState } from "react";

interface CarFormData {
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
}


type CarForm = {
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
}

type CarPreviewModalProps = {
  onClose: () => void;
  onPublish: (car: { title: string; price: number }) => void;
}

const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"];
const transmissionOptions = ["Manual", "Automatic"];

const CarPreviewModal: React.FC<CarPreviewModalProps> = ({ onClose, onPublish }) => {
  const [form, setForm] = useState<CarForm>({
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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 10),
    }));
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleImageDelete = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price) return;
    onPublish({
      title: form.title.trim(),
      price: Number(form.price),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-w-3xl w-full rounded-2xl bg-card border border-border shadow-xl p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Publish Car</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-muted-foreground mb-1" htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1" htmlFor="price">Price *</label>
            <input
              id="price"
              name="price"
              type="text"
              required
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="brand">Brand</label>
              <input
                id="brand"
                name="brand"
                type="text"
                value={form.brand}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="model">Model</label>
              <input
                id="model"
                name="model"
                type="text"
                value={form.model}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="year">Year</label>
              <input
                id="year"
                name="year"
                type="text"
                value={form.year}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="fuel">Fuel</label>
              <select
                id="fuel"
                name="fuel"
                value={form.fuel}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Select fuel</option>
                {fuelOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="transmission">Transmission</label>
              <select
                id="transmission"
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Select transmission</option>
                {transmissionOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1" htmlFor="images">Images (max 10)</label>
            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              disabled={form.images.length >= 10}
            />
            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img src={src} alt="Preview" className="w-full h-20 object-cover rounded-lg border border-border" />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      aria-label="Delete image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary text-white py-2 mt-4 disabled:bg-muted-foreground"
            disabled={!form.title || !form.price}
          >
            Publish
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarPreviewModal;
