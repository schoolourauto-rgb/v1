import { NextResponse } from "next/server";
import { apiSuccess, apiError } from "@/lib/apiResponse";

export async function GET() {
  return NextResponse.json(apiSuccess("OK"), { status: 200 });
}

export async function POST(req: Request) {
  let body;

  try {
    body = await req.json();
  } catch (err) {
    console.error("JSON Parse Failed:", err);
    return NextResponse.json(apiError("Invalid JSON"), { status: 400 });
  }

  return NextResponse.json(apiSuccess(true), { status: 200 });
}