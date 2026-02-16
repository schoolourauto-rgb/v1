import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store (for demo; use Redis in prod)
const ipStore: Record<string, { count: number; last: number }> = {};
const WINDOW = 60 * 1000; // 1 minute
const MAX = 10; // 10 requests per window

export function rateLimit(req: NextRequest | Request) {
  let ip = "unknown";
  if ("headers" in req && typeof req.headers.get === "function") {
    ip = req.headers.get("x-forwarded-for") || "unknown";
  }
  // NextRequest has .ip, Request does not
  if ("ip" in req && typeof (req as any).ip === "string") {
    ip = (req as any).ip || ip;
  }
  const now = Date.now();
  if (!ipStore[ip] || now - ipStore[ip].last > WINDOW) {
    ipStore[ip] = { count: 1, last: now };
    return null;
  }
  ipStore[ip].count++;
  ipStore[ip].last = now;
  if (ipStore[ip].count > MAX) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  return null;
}

// Usage: Call rateLimit(req) at top of route handler. If it returns a response, return it immediately.
