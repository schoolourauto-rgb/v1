// lib/logger.ts

const isDev = process.env.NODE_ENV !== "production";

export function logError(context: string, error: unknown) {
  if (isDev) {
    // Detailed logging in development
    // Never log secrets or sensitive data
    console.error(`[${context}]`, error);
  } else {
    // Sanitized logging in production
    if (error instanceof Error) {
      console.error(`[${context}]`, error.name);
    } else {
      console.error(`[${context}]`, "Error occurred");
    }
  }
}
