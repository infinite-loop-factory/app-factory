/**
 * Sip Note — Design Tokens (TypeScript)
 *
 * Expo / React Native 앱에서 import 하여 사용.
 *   import { theme, lightColors, darkColors } from "@/design-system/theme";
 *
 * 의미 기반 토큰명 only — gluestack scale (primary-0~950) 사용 안 함.
 * 다크 우선 · 라이트 보조.
 *
 * RN 의 Color API 는 oklch() 를 인식하지 못하므로 hex 로 컴파일된 값 사용.
 */

export type DrinkCategory =
  | "whiskey"
  | "wine"
  | "beer"
  | "sake"
  | "cocktail"
  | "etc";

export type PlaceCategory =
  | "bar"
  | "distillery"
  | "winery"
  | "brewery"
  | "restaurant"
  | "etc";

export type PairingMatch = "bad" | "okay" | "good" | "great";

export type ColorTokens = {
  /* Brand */
  brand: string;
  brandStrong: string;
  brandSoft: string;
  brandOn: string;

  /* Surfaces */
  bg: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  overlay: string;

  /* Text */
  text: string;
  textMuted: string;
  textSubtle: string;
  textFaint: string;
  textOnBrand: string;

  /* Borders */
  border: string;
  borderStrong: string;
  borderSubtle: string;

  /* Status */
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  info: string;
  infoSoft: string;

  /* Categories */
  drink: Record<DrinkCategory, string>;
  place: Record<PlaceCategory, string>;
  pair: Record<PairingMatch, string>;
};

/* ── Dark (default) ── */
export const darkColors: ColorTokens = {
  brand: "#D49A4F",
  brandStrong: "#B97F36",
  brandSoft: "#4A3621",
  brandOn: "#241910",

  bg: "#1F1B16",
  surface: "#28231D",
  surfaceRaised: "#312B23",
  surfaceSunken: "#191512",
  overlay: "rgba(20,16,12,0.72)",

  text: "#F4ECDC",
  textMuted: "#C7BCA6",
  textSubtle: "#8E8472",
  textFaint: "#5C5547",
  textOnBrand: "#241910",

  border: "#3D362C",
  borderStrong: "#544A3D",
  borderSubtle: "#2E281F",

  success: "#7CC79B",
  successSoft: "#264634",
  warning: "#E1B873",
  warningSoft: "#4A3a20",
  danger: "#E27260",
  dangerSoft: "#48241D",
  info: "#7DB7DC",
  infoSoft: "#1F3848",

  drink: {
    whiskey: "#C99461",
    wine: "#9C2A41",
    beer: "#D9B445",
    sake: "#CFCDB6",
    cocktail: "#D38593",
    etc: "#8E8472",
  },
  place: {
    bar: "#B98655",
    distillery: "#7A5A3A",
    winery: "#9C2A41",
    brewery: "#D2A746",
    restaurant: "#7CB392",
    etc: "#8E8472",
  },
  pair: {
    bad: "#B26350",
    okay: "#A29B89",
    good: "#84BC8E",
    great: "#DDB05D",
  },
};

/* ── Light ── */
export const lightColors: ColorTokens = {
  brand: "#B07533",
  brandStrong: "#8E5722",
  brandSoft: "#F4E5D0",
  brandOn: "#FFFCF7",

  bg: "#F8F4EC",
  surface: "#FDFAF3",
  surfaceRaised: "#FFFFFF",
  surfaceSunken: "#F1ECE2",
  overlay: "rgba(28,22,16,0.42)",

  text: "#2A211A",
  textMuted: "#5C5247",
  textSubtle: "#80766A",
  textFaint: "#ADA493",
  textOnBrand: "#FFFCF7",

  border: "#E1D9C7",
  borderStrong: "#B5A98F",
  borderSubtle: "#EFE9DA",

  success: "#3E7A55",
  successSoft: "#E2F0E5",
  warning: "#A26F1E",
  warningSoft: "#F4E9D2",
  danger: "#A23A2C",
  dangerSoft: "#F3DCD6",
  info: "#3F73A0",
  infoSoft: "#DDE8F2",

  drink: {
    whiskey: "#9A6B30",
    wine: "#7E1F31",
    beer: "#A6862D",
    sake: "#A8A48A",
    cocktail: "#A24F60",
    etc: "#80766A",
  },
  place: {
    bar: "#8B5F2A",
    distillery: "#5C4226",
    winery: "#7E1F31",
    brewery: "#A6862D",
    restaurant: "#3F7C5C",
    etc: "#80766A",
  },
  pair: {
    bad: "#8E3C2E",
    okay: "#807868",
    good: "#3F7E4D",
    great: "#A2761E",
  },
};

export const space = {
  px1: 4,
  px2: 8,
  px3: 12,
  px4: 16,
  px5: 20,
  px6: 24,
  px8: 32,
  px10: 40,
  px12: 48,
  px16: 64,
  px20: 80,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xl2: 28,
  pill: 999,
} as const;

export const fontSize = {
  display: 34,
  h1: 26,
  h2: 20,
  h3: 17,
  body: 16,
  bodySm: 14,
  caption: 12,
  overline: 11,
} as const;

export const lineHeight = {
  tight: 1.18,
  snug: 1.32,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1.5,
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

/**
 * Font families. Korean → Pretendard, English serif display → Fraunces.
 * Expo: load via expo-font in app entry.
 */
export const fontFamily = {
  display: "Fraunces", // Display headings (English-leaning)
  text: "Pretendard", // Body / UI (Korean-first)
  mono: "JetBrainsMono",
} as const;

export const target = {
  min: 44, // WCAG AA / iOS HIG hit target
} as const;

export const motion = {
  durationFast: 120,
  durationBase: 220,
  durationSlow: 360,
  easeStandard: [0.2, 0.0, 0.0, 1.0] as const,
  easeEmphasized: [0.3, 0.0, 0.0, 1.0] as const,
} as const;

/** Aggregate theme for ThemeProvider */
export const theme = {
  dark: {
    colors: darkColors,
    space,
    radius,
    fontSize,
    lineHeight,
    letterSpacing,
    fontWeight,
    fontFamily,
    target,
    motion,
  },
  light: {
    colors: lightColors,
    space,
    radius,
    fontSize,
    lineHeight,
    letterSpacing,
    fontWeight,
    fontFamily,
    target,
    motion,
  },
} as const;

export type Theme = typeof theme.dark;
