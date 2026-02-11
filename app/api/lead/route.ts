import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  const body = await req.json()
  const { carId, sellerId, name, email, phone, message } = body

  // Basic validation
  if (!carId || !sellerId || !name || !phone) {
    return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 })
  }

  // Prevent spam
  if (typeof message === "string" && (message.includes("http") || message.length > 500)) {
    return NextResponse.json({ success: false, error: "Invalid message." }, { status: 400 })
  }

  const supabase = createServerClient()
  const { error } = await supabase.from("leads").insert([
    {
      id: uuidv4(),
      car_id: carId,
      seller_id: sellerId,
      buyer_name: name,
      buyer_email: email,
      buyer_phone: phone,
      buyer_message: message,
      created_at: new Date().toISOString()
    }
  ])

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
