// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  presets: [nativewind],
  plugins: [],
} satisfies Config;
