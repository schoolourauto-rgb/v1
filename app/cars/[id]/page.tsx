export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return {
    title: `Car ${id} | OurAuto`,
    description: `Explore detailed specifications, pricing, and features for car ${id} on OurAuto.`,
  }
}

export const revalidate = 60
export default async function CarsDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">
        Car ID: {id}
      </h1>
    </div>
  )
}
