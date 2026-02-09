'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AddCarPage() {
  const supabase = createClient()
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    km_driven: '',
    fuel_type: '',
    transmission: '',
    description: '',
  })

  const [images, setImages] = useState<FileList | null>(null)
  const [preview, setPreview] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setImages(files)

    if (files) {
      const previews: string[] = []
      for (let i = 0; i < Math.min(files.length, 10); i++) {
        const reader = new FileReader()
        reader.onloadend = () => {
          previews.push(reader.result as string)
          if (previews.length === Math.min(files.length, 10)) {
            setPreview(previews)
          }
        }
        reader.readAsDataURL(files[i])
      }
    }
  }

  const validateForm = () => {
    if (!form.title.trim()) return 'Title is required'
    if (!form.brand.trim()) return 'Brand is required'
    if (!form.model.trim()) return 'Model is required'
    if (!form.year || isNaN(Number(form.year))) return 'Valid year is required'
    if (!form.price || isNaN(Number(form.price))) return 'Valid price is required'
    if (!form.km_driven || isNaN(Number(form.km_driven))) return 'Valid mileage is required'
    if (!form.fuel_type.trim()) return 'Fuel type is required'
    if (!form.transmission.trim()) return 'Transmission is required'
    if (!images || images.length < 5) return 'Minimum 5 photos required'
    return null
  }

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    try {
      const validationError = validateForm()
      if (validationError) {
        setError(validationError)
        setLoading(false)
        return
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in')
        setLoading(false)
        return
      }

      // Create car entry
      const { data: car, error: carError } = await supabase
        .from('cars')
        .insert({
          dealer_id: user.id,
          name: form.title,
          brand: form.brand,
          model: form.model,
          year: Number(form.year),
          price: Number(form.price),
          mileage: Number(form.km_driven),
          fuel_type: form.fuel_type,
          transmission: form.transmission,
          description: form.description,
          status: 'draft',
        })
        .select()
        .single()

      if (carError) {
        setError(carError.message)
        setLoading(false)
        return
      }

      // Upload images
      if (images) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${car.id}_${Date.now()}_${i}.${fileExt}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('car-images')
            .upload(`${car.id}/${fileName}`, file)

          if (uploadError) {
            console.error('Upload error:', uploadError)
            continue
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from('car-images').getPublicUrl(uploadData.path)

          await supabase.from('car_images').insert({
            car_id: car.id,
            image_url: publicUrl,
          })
        }
      }

      // Redirect to dashboard
      router.push('/dealer/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Add New Car</h1>
          <p className="text-zinc-400">List your vehicle on OurAuto marketplace</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Car Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-yellow-500">Car Details</h2>

            <input
              placeholder="Car Title (e.g., 2023 Honda Civic Type-R)"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500 transition"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={loading}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Brand"
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                disabled={loading}
              />
              <input
                placeholder="Model"
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Year"
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                disabled={loading}
              />
              <input
                type="number"
                placeholder="Price (₹)"
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                disabled={loading}
              />
            </div>

            <input
              type="number"
              placeholder="KM Driven"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500 transition"
              value={form.km_driven}
              onChange={(e) => setForm({ ...form, km_driven: e.target.value })}
              disabled={loading}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Fuel Type"
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                value={form.fuel_type}
                onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
                disabled={loading}
              />
              <input
                placeholder="Transmission"
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                disabled={loading}
              />
            </div>

            <textarea
              placeholder="Description (condition, features, service history, etc.)"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-yellow-500 transition h-24"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-yellow-500">Photos (Minimum 5 Required)</h2>

            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-yellow-500 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="file-input"
                onChange={handleImageChange}
                disabled={loading}
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <p className="text-zinc-400 text-sm">Click to upload or drag and drop</p>
                <p className="text-yellow-500 font-semibold mt-2">
                  {images ? `${images.length} files selected` : 'Choose images'}
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {preview.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-zinc-400">{preview.length} images selected</p>
                <div className="grid grid-cols-3 gap-3">
                  {preview.map((img, idx) => (
                    <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-zinc-700">
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Section */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading Car & Images...' : 'List Car on Marketplace'}
          </button>

          <p className="text-xs text-zinc-500 text-center">
            Your car will be saved as draft. You can publish after adding 5+ cars.
          </p>
        </div>
      </div>
    </div>
  )
}
