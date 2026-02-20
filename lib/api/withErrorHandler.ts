import { NextResponse } from "next/server";

export function withErrorHandler<T extends (...args: unknown[]) => Promise<unknown>>(handler: T) {
  return async function(...args: Parameters<T>) {
    try {
      return await handler(...args);
    } catch (err) {
      // Hide stack trace, standardize error
      const message = err instanceof Error ? err.message : "Internal server error";
      return NextResponse.json({
        error: message
      }, { status: 500 });
    }
  };
}
// Usage: export const POST = withErrorHandler(async (req) => { ... })
