

import { notFound } from "next/navigation"
import { Metadata } from "next"
import { createServerSupabase } from "@/lib/supabase/server"

interface PageProps {
	params: { id: string }
}

export const dynamic = "force-dynamic"

export async function generateMetadata(
	{ params }: PageProps
): Promise<Metadata> {
	try {
		const supabase = await createServerSupabase()

		const { data } = await supabase
			.from("cars")
			.select("brand, model")
			.eq("id", params.id)
			.single()

		if (!data) {
			return { title: "Car Not Found | OurAuto" }
		}

		return {
			title: `${data.brand} ${data.model} | OurAuto`
		}
	} catch {
		return { title: "Car | OurAuto" }
	}
}

export default async function CarDetailPage(
	{ params }: PageProps
) {
	try {
		const supabase = createServerClient()

		const { data, error } = await supabase
			.from("cars")
			.select("*")
			.eq("id", params.id)
			.single()

		if (error || !data) {
			notFound()
		}

		return (
			<div className="container mx-auto p-6">
				<h1 className="text-2xl font-bold">
					{data.brand} {data.model}
				</h1>

				<p className="mt-2 text-gray-500">
					₹ {data.price}
				</p>

				<p className="mt-4">
					{data.description ?? "No description available"}
				</p>
			</div>
		)
	} catch (error) {
		console.error("Car page error:", error)
		notFound()
	}
}
