import type { DiceFaceValue } from "@/components/dice/dice-orientations";

import { FACE_SHADE } from "@/components/dice/dice-shading";

export type DiceGlassMaterial = {
  faceLight: (face: DiceFaceValue) => string;
  faceDark: (face: DiceFaceValue) => string;
  edge: string;
  pip: string;
  pipShadow: string;
  contactShadow: string;
};

function shadePair(
  hi: string,
  mid: string,
  lo: string,
  face: DiceFaceValue,
): [string, string] {
  const shade = FACE_SHADE[face];
  if (shade >= 1.02) return [hi, mid];
  if (shade <= 0.9) return [mid, lo];
  return [hi, lo];
}

export const BLUE_GLASS_DICE: DiceGlassMaterial = {
  faceLight: (face) => shadePair("#9fd0ff", "#3d88ef", "#1a4da8", face)[0],
  faceDark: (face) => shadePair("#9fd0ff", "#3d88ef", "#1a4da8", face)[1],
  edge: "#dceeff",
  pip: "#f7fbff",
  pipShadow: "rgba(8,30,80,0.55)",
  contactShadow: "rgba(28,72,168,0.42)",
};

export const GOLD_GLASS_DICE: DiceGlassMaterial = {
  faceLight: (face) => shadePair("#ffe88c", "#d4a826", "#805808", face)[0],
  faceDark: (face) => shadePair("#ffe88c", "#d4a826", "#805808", face)[1],
  edge: "#fff4c8",
  pip: "#fff8e6",
  pipShadow: "rgba(72,48,6,0.5)",
  contactShadow: "rgba(160,110,20,0.4)",
};

export function resolveDiceMaterial(
  variant: "default" | "gold",
): DiceGlassMaterial {
  return variant === "gold" ? GOLD_GLASS_DICE : BLUE_GLASS_DICE;
}
