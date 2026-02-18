import { NextRequest, NextResponse } from "next/server";
import { sendPush } from "@/lib/services/sendPush";

export async function POST(req: NextRequest) {
  try {
    const { dealerId, payload } = await req.json();
    if (!dealerId || !payload) return NextResponse.json({ error: "Missing data" }, { status: 400 });
    await sendPush(dealerId, payload);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to send push" }, { status: 500 });
  }
}
