/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Updated to use monochromatic design system with grays and limited accent colors.
 */

const tintColorLight = "#71717a"; // secondary-500
const tintColorDark = "#a1a1aa"; // secondary-400

export const Colors = {
  light: {
    text: "#09090b", // typography-950
    background: "#ffffff", // background-0
    tint: tintColorLight,
    icon: "#71717a", // secondary-500
    tabIconDefault: "#a1a1aa", // secondary-400
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fafafa", // typography-50
    background: "#09090b", // background-950
    tint: tintColorDark,
    icon: "#a1a1aa", // secondary-400
    tabIconDefault: "#71717a", // secondary-500
    tabIconSelected: tintColorDark,
  },
};
