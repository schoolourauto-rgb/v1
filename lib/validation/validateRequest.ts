import { z, ZodSchema } from "zod";
import { NextRequest, NextResponse } from "next/server";

export async function validateJsonRequest<T>(req: Request | NextRequest, schema: ZodSchema<T>): Promise<
  | { error: true; response: ReturnType<typeof NextResponse.json> }
  | { error: false; data: T }
> {
  if (req.headers.get("content-type") !== "application/json") {
    return {
      error: true,
      response: NextResponse.json({ error: "Invalid content-type" }, { status: 415 })
    };
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return {
      error: true,
      response: NextResponse.json({ error: "Malformed JSON" }, { status: 400 })
    };
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    // Log the error details for debugging
    console.log('Zod validation error:', result.error.flatten());
    return {
      error: true,
      response: NextResponse.json({ error: result.error.flatten() }, { status: 422 })
    };
  }
  // result.data is always type T here
  return { error: false, data: result.data as T };
}
