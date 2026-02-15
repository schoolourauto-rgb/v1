import { NextResponse } from "next/server"
import { LeadsService } from "@/lib/services/leads.service"

export async function POST(req: Request) {
  const body = await req.json();
  const { car_id, name, email, phone, message } = body;

  // Basic validation
  if (!car_id || !name || !phone) {
    return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
  }

  // Prevent spam
  if (typeof message === "string" && (message.includes("http") || message.length > 500)) {
    return NextResponse.json({ success: false, error: "Invalid message." }, { status: 400 });
  }

  try {
    await LeadsService.createLead({
      car_id,
      name,
      email,
      phone,
      message: message ?? null,
      created_at: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
