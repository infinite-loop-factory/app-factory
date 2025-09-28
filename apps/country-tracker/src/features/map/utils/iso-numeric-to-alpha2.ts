import { ISO_NUMERIC_TO_ALPHA2 } from "@/features/map/constants/iso-numeric-to-alpha2";

export function numericToAlpha2(numeric: number | string): string | undefined {
  const key = String(numeric).padStart(3, "0");
  return ISO_NUMERIC_TO_ALPHA2[key];
}
