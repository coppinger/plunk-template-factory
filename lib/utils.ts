import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BODY_PLACEHOLDER } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function composeEmail(globalHtml: string, bodyHtml: string): string {
  if (!globalHtml.includes(BODY_PLACEHOLDER)) return globalHtml + bodyHtml;
  return globalHtml.replace(BODY_PLACEHOLDER, bodyHtml);
}
