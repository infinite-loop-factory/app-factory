export function hexToRgb(hex: string): string {
  if (!hex.startsWith("#")) return hex;

  let s = hex.replace(/^#/, "");
  if (s.length === 1) s = s.repeat(6);
  if (s.length === 2) s = s.repeat(3);
  if (s.length === 3)
    s = s
      .split("")
      .map((c) => c + c)
      .join("");

  const num = Number.parseInt(s, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `${r} ${g} ${b}`;
}
