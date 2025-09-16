import type { Config } from "tailwindcss";

// @ts-expect-error - no types
import nativewind from "nativewind/preset";

export default {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : "class",
  content: ["./src/**/*.{ts,tsx}"],
  presets: [nativewind],
  important: "html",
  plugins: [],
} satisfies Config;
