// @ts-expect-error - no types

import type { Config } from "tailwindcss";

import nativewind from "nativewind/preset";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  presets: [nativewind],
  plugins: [],
} satisfies Config;
