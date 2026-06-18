export type CraftPalette = {
  background: string;
  maple: string;
  walnut: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  /** Game-table felt backdrop. */
  tableFelt: string;
  tableFeltDeep: string;
  /** Wooden frame / plank surfaces sitting on the felt. */
  frameWood: string;
  frameWoodEdge: string;
  /** Light text on felt and wood. */
  cream: string;
  creamMuted: string;
  playerYou: string;
  playerCpu: string;
  ladder: string;
  snake: string;
  interference: string;
  orbGlow: string;
  diceFace: string;
  dicePip: string;
};

export const CRAFT_LIGHT: CraftPalette = {
  background: "#f4ece0",
  maple: "#e8d5b0",
  walnut: "#b8935a",
  card: "#faf6ef",
  border: "#d4c4a8",
  text: "#3d2e1f",
  textMuted: "#7a6652",
  tableFelt: "#33614a",
  tableFeltDeep: "#27503c",
  frameWood: "#7a4f23",
  frameWoodEdge: "#5b3a17",
  cream: "#f6ecd8",
  creamMuted: "#d9c9ad",
  playerYou: "#1e4d8c",
  playerCpu: "#8b3a3a",
  ladder: "#2d6a4f",
  snake: "#9b2335",
  interference: "#6b4c9a",
  orbGlow: "#c9a227",
  diceFace: "#f0e4d0",
  dicePip: "#3d2e1f",
};

/** Craft Board night variant (epic #208) */
export const CRAFT_DARK: CraftPalette = {
  background: "#231b0f",
  maple: "#3d2e1f",
  walnut: "#5c4a32",
  card: "#2f2418",
  border: "#4a3b28",
  text: "#f4ece0",
  textMuted: "#b8a690",
  tableFelt: "#1e3a2c",
  tableFeltDeep: "#162c21",
  frameWood: "#5d3f1e",
  frameWoodEdge: "#422c12",
  cream: "#f4ece0",
  creamMuted: "#cdbb9e",
  playerYou: "#6ba3e8",
  playerCpu: "#e07a7a",
  ladder: "#5dab84",
  snake: "#d45668",
  interference: "#a78bd4",
  orbGlow: "#e8c547",
  diceFace: "#4a3b28",
  dicePip: "#f4ece0",
};
