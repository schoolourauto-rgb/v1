import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (for demo; use Redis in production)
const ipHits: Record<string, { count: number; last: number }> = {};
const WINDOW = 60 * 1000; // 1 minute
const LIMIT = 10; // 10 requests per minute

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/dealer/cars')) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    if (!ipHits[ip] || now - ipHits[ip].last > WINDOW) {
      ipHits[ip] = { count: 1, last: now };
    } else {
      ipHits[ip].count++;
      ipHits[ip].last = now;
    }
    if (ipHits[ip].count > LIMIT) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/dealer/cars/:path*'],
};
