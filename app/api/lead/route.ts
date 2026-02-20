

import { NextResponse } from "next/server";
import { LeadsService } from "@/lib/services/leads.service";
import { LeadSchema } from "@/lib/validation/zodSchemas";
import { validateJsonRequest } from "@/lib/validation/validateRequest";
import { rateLimit } from "@/middleware/rateLimit";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { logError } from "@/lib/logger";

  const req = args[0] as Request;
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
    return NextResponse.json(apiSuccess(true), { status: 200 });
  } catch (e) {
    if (e instanceof Error && e.message === "Dealer unavailable") {
      return NextResponse.json(apiError("Dealer unavailable"), { status: 403 });
    }
    logError("Lead creation error", e);
    return NextResponse.json(apiError(), { status: 500 });
  }
});
