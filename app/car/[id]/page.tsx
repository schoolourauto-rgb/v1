export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const title = `Car ${id} | OurAuto`
  const description = `Explore specifications, features, pricing and dealer details for Car ${id} on OurAuto.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://ourauto.in/car/${id}`,
      siteName: "OurAuto",
      type: "website",
      images: [
        `https://ourauto.in/api/share-image/${id}`
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `https://ourauto.in/api/share-image/${id}`
      ],
    },
  }
}

export const revalidate = 60
type Params = {
  id: string
}

export default async function CarDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `Car ${id}`,
    brand: {
      "@type": "Brand",
      name: "OurAuto",
    },
    description: `Explore specifications and pricing for Car ${id}.`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "Contact for price",
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <div className="min-h-screen p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <h1 className="text-2xl font-bold">
        Car ID: {id}
      </h1>
      <a
        href={`https://wa.me/?text=Check this car 🚗 ${process.env.NEXT_PUBLIC_SITE_URL}/car/${id}`}
        target="_blank"
        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 inline-block"
      >
        Share on WhatsApp
      </a>
    </div>
  )
}
