/**
 * Below are colors that are used in app. The colors are defined in light and dark mode.
 * Coffee-inspired modern color palette
 */

const tintColorLight = "#6D4C41";
const tintColorDark = "#A1887F";

const primaryLight = "#5D4037";
const primaryDark = "#8D6E63";

const secondaryLight = "#8D6E63";
const secondaryDark = "#BCAAA4";

const accentLight = "#D7CCC8";
const accentDark = "#4E342E";

export const COLORS = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    primary: primaryLight,
    secondary: secondaryLight,
    accent: accentLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    primary: primaryDark,
    secondary: secondaryDark,
    accent: accentDark,
  },
};
