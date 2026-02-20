// lib/apiResponse.ts

export type ApiResponse<T = any> =
  | { success: true; data: T }
  | { success: false; error: string };

export function apiSuccess<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function apiError(error: string = "Something went wrong"): ApiResponse<never> {
  return { success: false, error };
}
