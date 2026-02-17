
import { NextResponse } from "next/server";
import { LeadsService } from "@/lib/services/leads.service";
import { LeadSchema } from "@/lib/validation/zodSchemas";
import { validateJsonRequest } from "@/lib/validation/validateRequest";
import { rateLimit } from "@/middleware/rateLimit";
import { withErrorHandler } from "@/lib/api/withErrorHandler";

export const POST = withErrorHandler(async (req: Request) => {
  // Rate limit
  const rl = rateLimit(req);
  if (rl) return rl;
  const validation = await validateJsonRequest(req, LeadSchema);
  if (validation.error) return validation.response;
  const { car_id, name, email, phone, message } = validation.data;
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
  } catch (e: any) {
    if (e.message === "Dealer unavailable") {
      return NextResponse.json({ error: "Dealer unavailable" }, { status: 403 });
    }
    return NextResponse.json({ error: e.message || "Failed to submit lead" }, { status: 400 });
  }
});
