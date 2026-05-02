/**
 * Sip Note — semantic CSS color tokens (light + dark).
 *
 * Source of truth: `@/design-system/theme.ts` (hex values).
 * Shape consumed by `src/components/ui/gluestack-ui-provider/config.ts` via
 * `vars(removeRgbWrapper(TOKENS[mode]))`. Each value is `rgb(R G B)` so that
 * `rgb(var(--color-x) / <alpha-value>)` in tailwind keeps working.
 *
 * Naming: semantic only — no gluestack-style numeric ramp (primary-50 etc.).
 */

import type { ColorTokens } from "@/design-system/theme";

import { darkColors, lightColors } from "@/design-system/theme";

const hexToRgbTriplet = (hex: string): string => {
  const v = hex.trim().replace("#", "");
  const full =
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
};

const wrap = (hex: string): string => `rgb(${hexToRgbTriplet(hex)})`;

const buildVars = (c: ColorTokens) => ({
  "--color-brand": wrap(c.brand),
  "--color-brand-strong": wrap(c.brandStrong),
  "--color-brand-soft": wrap(c.brandSoft),
  "--color-brand-on": wrap(c.brandOn),

  "--color-bg": wrap(c.bg),
  "--color-surface": wrap(c.surface),
  "--color-surface-raised": wrap(c.surfaceRaised),
  "--color-surface-sunken": wrap(c.surfaceSunken),

  "--color-text": wrap(c.text),
  "--color-text-muted": wrap(c.textMuted),
  "--color-text-subtle": wrap(c.textSubtle),
  "--color-text-faint": wrap(c.textFaint),
  "--color-text-on-brand": wrap(c.textOnBrand),

  "--color-border": wrap(c.border),
  "--color-border-strong": wrap(c.borderStrong),
  "--color-border-subtle": wrap(c.borderSubtle),

  "--color-success": wrap(c.success),
  "--color-success-soft": wrap(c.successSoft),
  "--color-warning": wrap(c.warning),
  "--color-warning-soft": wrap(c.warningSoft),
  "--color-danger": wrap(c.danger),
  "--color-danger-soft": wrap(c.dangerSoft),
  "--color-info": wrap(c.info),
  "--color-info-soft": wrap(c.infoSoft),

  "--color-cat-whiskey": wrap(c.drink.whiskey),
  "--color-cat-wine": wrap(c.drink.wine),
  "--color-cat-beer": wrap(c.drink.beer),
  "--color-cat-sake": wrap(c.drink.sake),
  "--color-cat-cocktail": wrap(c.drink.cocktail),
  "--color-cat-etc": wrap(c.drink.etc),

  "--color-place-bar": wrap(c.place.bar),
  "--color-place-distillery": wrap(c.place.distillery),
  "--color-place-winery": wrap(c.place.winery),
  "--color-place-brewery": wrap(c.place.brewery),
  "--color-place-restaurant": wrap(c.place.restaurant),
  "--color-place-etc": wrap(c.place.etc),

  "--color-pair-bad": wrap(c.pair.bad),
  "--color-pair-okay": wrap(c.pair.okay),
  "--color-pair-good": wrap(c.pair.good),
  "--color-pair-great": wrap(c.pair.great),
});

export const TOKENS = {
  light: buildVars(lightColors),
  dark: buildVars(darkColors),
};

export type SemanticColorVar = keyof ReturnType<typeof buildVars>;
