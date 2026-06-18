/** Darken a #rrggbb color by a 0..1 factor (0.65 → 65% brightness). */
export function darkenColor(hex: string, factor = 0.65): string {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match?.[1]) return hex;
  const value = Number.parseInt(match[1], 16);
  const channel = (shift: number) =>
    Math.round(((value >> shift) & 0xff) * factor);
  const r = channel(16);
  const g = channel(8);
  const b = channel(0);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** Mix a #rrggbb color toward white by a 0..1 amount (0.2 → 20% lighter). */
export function lightenColor(hex: string, amount = 0.2): string {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match?.[1]) return hex;
  const value = Number.parseInt(match[1], 16);
  const channel = (shift: number) => {
    const c = (value >> shift) & 0xff;
    return Math.round(c + (255 - c) * amount);
  };
  const r = channel(16);
  const g = channel(8);
  const b = channel(0);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
