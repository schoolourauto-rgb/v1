import React from "react";

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="text-green-600 text-sm mt-2">{message}</div>;
}
