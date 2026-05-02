import type { Config } from "tailwindcss";

// @ts-expect-error - no types
import nativewind from "nativewind/preset";

const ref = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./src/**/*.{tsx,jsx,ts,js}", "./index.{tsx,jsx,ts,js}"],
  presets: [nativewind],
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(cat|place|pair)-(whiskey|wine|beer|sake|cocktail|etc|bar|distillery|winery|brewery|restaurant|bad|okay|good|great)/,
    },
  ],
  plugins: [],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: ref("--color-brand"),
          strong: ref("--color-brand-strong"),
          soft: ref("--color-brand-soft"),
          on: ref("--color-brand-on"),
        },
        bg: ref("--color-bg"),
        surface: {
          DEFAULT: ref("--color-surface"),
          raised: ref("--color-surface-raised"),
          sunken: ref("--color-surface-sunken"),
        },
        text: {
          DEFAULT: ref("--color-text"),
          muted: ref("--color-text-muted"),
          subtle: ref("--color-text-subtle"),
          faint: ref("--color-text-faint"),
          onBrand: ref("--color-text-on-brand"),
        },
        border: {
          DEFAULT: ref("--color-border"),
          strong: ref("--color-border-strong"),
          subtle: ref("--color-border-subtle"),
        },
        success: {
          DEFAULT: ref("--color-success"),
          soft: ref("--color-success-soft"),
        },
        warning: {
          DEFAULT: ref("--color-warning"),
          soft: ref("--color-warning-soft"),
        },
        danger: {
          DEFAULT: ref("--color-danger"),
          soft: ref("--color-danger-soft"),
        },
        info: {
          DEFAULT: ref("--color-info"),
          soft: ref("--color-info-soft"),
        },
        cat: {
          whiskey: ref("--color-cat-whiskey"),
          wine: ref("--color-cat-wine"),
          beer: ref("--color-cat-beer"),
          sake: ref("--color-cat-sake"),
          cocktail: ref("--color-cat-cocktail"),
          etc: ref("--color-cat-etc"),
        },
        place: {
          bar: ref("--color-place-bar"),
          distillery: ref("--color-place-distillery"),
          winery: ref("--color-place-winery"),
          brewery: ref("--color-place-brewery"),
          restaurant: ref("--color-place-restaurant"),
          etc: ref("--color-place-etc"),
        },
        pair: {
          bad: ref("--color-pair-bad"),
          okay: ref("--color-pair-okay"),
          good: ref("--color-pair-good"),
          great: ref("--color-pair-great"),
        },
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "28px",
        pill: "9999px",
      },
      fontFamily: {
        display: [
          "Fraunces",
          "Pretendard",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "system-ui",
          "serif",
        ],
        text: [
          "Pretendard",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "system-ui",
          "sans-serif",
        ],
        mono: ["JetBrainsMono", "SpaceMono", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["34px", { lineHeight: "1.18", letterSpacing: "-0.02em" }],
        h1: ["26px", { lineHeight: "1.18", letterSpacing: "-0.02em" }],
        h2: ["20px", { lineHeight: "1.32" }],
        h3: ["17px", { lineHeight: "1.32" }],
        body: ["16px", { lineHeight: "1.7" }],
        bodySm: ["14px", { lineHeight: "1.5" }],
        caption: ["12px", { lineHeight: "1.5" }],
        overline: ["11px", { lineHeight: "1.32", letterSpacing: "0.12em" }],
      },
      boxShadow: {
        "card-1": "0 1px 2px rgb(0 0 0 / 0.32), 0 0 0 1px rgb(0 0 0 / 0.18)",
        "card-2": "0 4px 14px rgb(0 0 0 / 0.40), 0 1px 3px rgb(0 0 0 / 0.24)",
        "card-3": "0 12px 32px rgb(0 0 0 / 0.50), 0 2px 8px rgb(0 0 0 / 0.30)",
        fab: "0 12px 28px rgb(var(--color-brand-strong) / 0.45), 0 4px 10px rgb(0 0 0 / 0.40)",
      },
    },
  },
} satisfies Config;
