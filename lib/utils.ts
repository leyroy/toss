import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to check if the code is running on the server or client
const isServer = typeof window === "undefined"
export function isClient() {
  return !isServer
}
