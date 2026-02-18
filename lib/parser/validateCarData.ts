// lib/parser/validateCarData.ts
import { CarData } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCarData(data: CarData): ValidationResult {
  const errors: string[] = [];
  if (!data.year) errors.push("Year required");
  if (!data.make) errors.push("Make required");
  if (!data.model) errors.push("Model required");
  if (!data.price) errors.push("Price required");
  return {
    valid: errors.length === 0,
    errors,
  };
}
