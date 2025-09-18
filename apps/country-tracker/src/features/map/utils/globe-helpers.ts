const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
export const DEFAULT_ALPHA_COLOR = "rgba(0, 0, 0, 0.4)";

export const hexToRgb = (hex: string): [number, number, number] | null => {
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char.repeat(2))
      .join("");
  }
  if (normalized.length !== 6) return null;
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

export const addAlphaToColor = (
  color: string | undefined,
  alpha: number,
  fallback: string = DEFAULT_ALPHA_COLOR,
): string => {
  if (!color) {
    return fallback;
  }

  if (HEX_COLOR_PATTERN.test(color)) {
    const rgb = hexToRgb(color);
    if (rgb) {
      const [r, g, b] = rgb;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

  if (color.startsWith("rgba")) {
    return color.replace(
      /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
      (_, r, g, b) => `rgba(${r.trim()}, ${g.trim()}, ${b.trim()}, ${alpha})`,
    );
  }

  if (color.startsWith("rgb")) {
    const components = color
      .replace(/^rgb\(/, "")
      .replace(/\)$/, "")
      .split(",")
      .map((segment) => segment.trim());
    if (components.length === 3) {
      return `rgba(${components.join(", ")}, ${alpha})`;
    }
  }

  return fallback;
};

export const normalizeLongitude = (lngParam: number): number => {
  let lng = lngParam % 360;
  if (lng > 180) {
    lng = lng - 360;
  }
  if (lng < -180) {
    lng = lng + 360;
  }
  return lng;
};

export const calculateLongitudeDifference = (
  start: number,
  end: number,
): number => {
  const directDiff = normalizeLongitude(end - start);
  if (Math.abs(directDiff) > 180) {
    return directDiff > 0 ? directDiff - 360 : directDiff + 360;
  }
  return directDiff;
};

export const globeHelpers = {
  hexToRgb,
  addAlphaToColor,
  normalizeLongitude,
  calculateLongitudeDifference,
};

export default globeHelpers;
