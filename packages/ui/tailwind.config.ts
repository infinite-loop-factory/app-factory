import type { Config } from "tailwindcss";

// @ts-expect-error - no types
import nativewind from "nativewind/preset";

export default {
  content: ["src/**/*.{js,jsx,ts,tsx}"],
  presets: [nativewind],
  plugins: [],
} satisfies Config;
