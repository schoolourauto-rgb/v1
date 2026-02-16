import { NextResponse } from "next/server";

export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(handler: T) {
  return async function(...args: Parameters<T>) {
    try {
      return await handler(...args);
    } catch (err: any) {
      // Hide stack trace, standardize error
      return NextResponse.json({
        error: err?.message || "Internal server error"
      }, { status: 500 });
    }
  };
}
// Usage: export const POST = withErrorHandler(async (req) => { ... })
