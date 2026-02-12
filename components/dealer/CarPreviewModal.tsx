"use client"

import { useState } from "react"
import { X } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  parsedCar?: any
  onPublish?: (car: any) => void
}

export default function CarPreviewModal({
  open,
  onClose,
  parsedCar,
  onPublish,
}: Props) {
  const [images, setImages] = useState<File[]>([])

  if (!open) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setImages((prev) => [...prev, ...files].slice(0, 10))
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePublish = () => {
    if (onPublish) onPublish(parsedCar)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Preview & Publish
        </h2>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />

        <div className="grid grid-cols-3 gap-3 mb-6">
          {images.map((file, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(file)}
                className="w-full h-24 object-cover rounded-lg border"
                alt=""
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handlePublish}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3"
        >
          Publish Car
        </button>
      </div>
    </div>
  )
}
