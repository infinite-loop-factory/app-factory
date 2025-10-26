import { ALPHA3_TO_ALPHA2 } from "@/features/map/constants/alpha3-to-alpha2";
import { numericToAlpha2 } from "@/features/map/utils/iso-numeric-to-alpha2";

export function normalizeCountryCode(
  code: string | null | undefined,
): string | null {
  if (!code) return null;
  const raw = String(code).trim();
  if (!raw) return null;
  const upper = raw.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper)) return upper;
  if (/^\d{1,3}$/.test(upper)) {
    const mapped = numericToAlpha2(upper);
    return mapped ? mapped.toUpperCase() : null;
  }
  if (/^[A-Z]{3}$/.test(upper)) {
    const mapped = ALPHA3_TO_ALPHA2[upper];
    return mapped ? mapped.toUpperCase() : null;
  }
  return null;
}
