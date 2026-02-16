export function logInfo(message: string, meta?: Record<string, any>) {
  console.info(JSON.stringify({ level: "info", message, ...meta }));
}
export function logWarn(message: string, meta?: Record<string, any>) {
  console.warn(JSON.stringify({ level: "warn", message, ...meta }));
}
export function logError(message: string, meta?: Record<string, any>) {
  console.error(JSON.stringify({ level: "error", message, ...meta }));
}
