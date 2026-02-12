'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  transmission: string
  color?: string
  description?: string
}

export default function EditCarPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string

  const [car, setCar] = useState<Car | null>(null)
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
    color: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchCar = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: carData } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .eq('dealer_id', user.id)
        .single()

      if (carData) {
        setCar(carData)
        setForm({
          title: carData.name,
          brand: carData.brand,
          model: carData.model,
          year: carData.year.toString(),
          price: carData.price.toString(),
          km_driven: carData.mileage.toString(),
          fuel_type: carData.fuel_type,
          transmission: carData.transmission,
          description: carData.description || '',
          color: carData.color || '',
        })
      }

      setLoading(false)
    }

    fetchCar()
  }, [carId, supabase, router])

  const handleUpdate = async () => {
    setError(null)
    setSaving(true)

    try {
      if (!form.title.trim()) {
        setError('Title is required')
        setSaving(false)
        return
      }

      const { error: updateError } = await supabase
        .from('cars')
        .update({
          name: form.title,
          brand: form.brand,
          model: form.model,
          year: Number(form.year),
          price: Number(form.price),
          mileage: Number(form.km_driven),
          fuel_type: form.fuel_type,
          transmission: form.transmission,
          description: form.description,
          color: form.color,
        })
        .eq('id', carId)

      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }

      router.push('/dealer/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)

    try {
      // Delete car images first
      await supabase.from('car_images').delete().eq('car_id', carId)

      // Delete car
      const { error: deleteError } = await supabase.from('cars').delete().eq('id', carId)

      if (deleteError) {
        setError(deleteError.message)
        setSaving(false)
        return
      }

      router.push('/dealer/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading car...</p>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Car not found</p>
          <Link href="/dealer/dashboard" className="text-yellow-500 hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/dealer/dashboard" className="text-yellow-500 hover:underline mb-4 inline-block text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Edit Car</h1>
          <p className="text-muted-foreground">Update your car listing</p>
        </div>

        <div className="bg-card text-card-foreground border border-border p-8 rounded-xl shadow-sm space-y-6">
          {error && (
            <div className="bg-danger/10 border border-danger/40 text-danger rounded-2xl p-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Car Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-yellow-500">Car Details</h2>

            <input
              placeholder="Car Title"
              className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={saving}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Brand"
                className="p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                disabled={saving}
              />
              <input
                placeholder="Model"
                className="p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Year"
                className="p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                disabled={saving}
              />
              <input
                placeholder="Color"
                className="p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Price (₹)"
                className="p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                disabled={saving}
              />
              <input
                type="number"
                placeholder="KM Driven"
                className="p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
                value={form.km_driven}
                onChange={(e) => setForm({ ...form, km_driven: e.target.value })}
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Fuel Type"
                className="p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
                value={form.fuel_type}
                onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
                disabled={saving}
              />
              <input
                placeholder="Transmission"
                className="p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                disabled={saving}
              />
            </div>

            <textarea
              placeholder="Description"
              className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200 h-24"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={saving}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-semibold p-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={saving}
              className="flex-1 bg-muted text-foreground border border-border font-semibold p-3 rounded-lg hover:bg-muted/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            >
              Delete Car
            </button>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="bg-muted border border-border p-6 rounded-lg space-y-4">
                <p className="text-muted-foreground font-semibold">Are you sure you want to delete this car?</p>
                <p className="text-sm text-muted-foreground">This action cannot be undone and will also delete all associated images.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-semibold p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={saving}
                  className="flex-1 bg-muted text-foreground border border-border font-semibold p-2 rounded-lg hover:bg-muted/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
