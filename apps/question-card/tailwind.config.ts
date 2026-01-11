import type { Config } from "tailwindcss";

// @ts-expect-error - nativewind preset types not properly exported
import nativewind from "nativewind/preset";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  presets: [nativewind],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBMPlexSansKR-Regular"],
        medium: ["IBMPlexSansKR-Medium"],
        semibold: ["IBMPlexSansKR-SemiBold"],
        bold: ["IBMPlexSansKR-Bold"],
      },
    },
  },
  plugins: [],
} satisfies Config;
