import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import EditCarForm from "./EditCarForm"

export default async function EditCarPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // 1️⃣ Get Logged In User
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return notFound()
  }

  // 2️⃣ Fetch Car (Only if belongs to dealer)
  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", params.id)
    .eq("dealer_id", user.id)
    .single()

  if (error || !car) {
    return notFound()
  }

  return <EditCarForm car={car} />
}
