
import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/apiResponse";

// Minimal placeholder route to avoid module errors
export async function POST(req: Request) {
  return NextResponse.json(apiSuccess(true), { status: 200 });
}
