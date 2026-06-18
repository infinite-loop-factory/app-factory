import type { DiceFaceValue } from "@/components/dice/dice-orientations";

/** Relative brightness per face (key light from top-front). */
export const FACE_SHADE: Record<DiceFaceValue, number> = {
  1: 1.06,
  3: 1.03,
  2: 0.97,
  5: 0.94,
  4: 0.88,
  6: 0.8,
};

function channel(hex: string, start: number): number {
  return Number.parseInt(hex.slice(start, start + 2), 16);
}

export function mixHex(hex: string, factor: number): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;
  const clamp = (value: number) =>
    Math.round(Math.min(255, Math.max(0, value)));
  const r = clamp(channel(normalized, 0) * factor);
  const g = clamp(channel(normalized, 2) * factor);
  const b = clamp(channel(normalized, 4) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function faceGradient(base: string, face: DiceFaceValue): string {
  const [light, dark] = faceGradientColors(base, face);
  return `linear-gradient(145deg, ${light}, ${dark})`;
}

export function faceGradientColors(
  base: string,
  face: DiceFaceValue,
): [string, string] {
  const shade = FACE_SHADE[face];
  return [mixHex(base, shade * 1.08), mixHex(base, shade * 0.82)];
}
