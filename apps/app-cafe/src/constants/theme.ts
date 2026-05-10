export const THEME_MODE_ENUM = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export type ThemeType = (typeof THEME_MODE_ENUM)[keyof typeof THEME_MODE_ENUM];

export const THEME_STYLE_ENUM = {
  STARS: "stars",
  SPOTLIGHT: "spotlight",
} as const;

export type ThemeStyle =
  (typeof THEME_STYLE_ENUM)[keyof typeof THEME_STYLE_ENUM];

export const TAB_BAR_STYLE_ENUM = {
  MODERN: "modern",
  RETRO: "retro",
} as const;

export type TabBarStyle =
  (typeof TAB_BAR_STYLE_ENUM)[keyof typeof TAB_BAR_STYLE_ENUM];
