import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 * @param inputs - Class names and conditional classes
 * @returns Combined class name string
 */
export function cn(...inputs: (string | undefined)[]) {
  return twMerge(clsx(inputs));
}
