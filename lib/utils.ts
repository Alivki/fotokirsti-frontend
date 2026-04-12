import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const data = (err as { response?: { data?: unknown } }).response?.data
    if (typeof data === "string") return data
    if (data && typeof data === "object") {
      for (const key of ["message", "error", "detail"] as const) {
        const value = (data as Record<string, unknown>)[key]
        if (typeof value === "string" && value.length > 0) return value
      }
    }
  }
  if (err instanceof Error) return err.message
  return ""
}
