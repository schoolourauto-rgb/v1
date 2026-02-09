"use client"

import { useState } from 'react'

export default function CarDetail({ car, user }: any) {
  const images = car.car_images || []
  const [selected, setSelected] = useState(images[0]?.image_url)

  const dealerMobile = car.profiles?.mobile

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{car.title || car.name}</h1>

      {/* Main Image */}
      {selected && (
        <img
          src={selected}
          className="w-full h-96 object-cover rounded-xl"
        />
      )}

      {/* Thumbnails */}
      <div className="flex gap-3 mt-4">
        {images.map((img: any, index: number) => (
          <img
            key={index}
            src={img.image_url}
            onClick={() => setSelected(img.image_url)}
            className="w-24 h-24 object-cover rounded cursor-pointer border"
          />
        ))}
      </div>

      <p className={!user ? 'blur-md mt-6' : 'mt-6'}>
        {car.description}
      </p>

      {!user && (
        <p className="text-yellow-500 mt-4">Login to view full details</p>
      )}

      {dealerMobile && (
        <a
          href={`https://wa.me/91${dealerMobile}?text=${encodeURIComponent(
            `I'm interested in ${car.title || car.name}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 bg-green-500 text-white px-6 py-3 rounded-lg"
        >
          Contact Dealer on WhatsApp
        </a>
      )}
    </div>
  )
}
