import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Masks the first 3 digits of a phone number with asterisks for display purposes.
// Examples:
//  - "123456789" -> "***456789"
//  - "12" -> "**" (mask up to the first 3 chars available)
export function maskPhone(phone?: string): string {
  const p = (phone ?? '').trim();
  if (!p) return '';
  const maskLen = Math.min(3, p.length);
  return '*'.repeat(maskLen) + p.slice(maskLen);
}
