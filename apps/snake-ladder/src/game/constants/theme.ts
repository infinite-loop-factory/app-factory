import { CRAFT_LIGHT } from "@/game/constants/palettes";

/** Craft Board design tokens — light palette default for tests */
export const CRAFT = CRAFT_LIGHT;

/** Rounded display font for game chrome (numbers, banners, buttons). */
export const GAME_FONT = "Jua";

/**
 * Dark ink for text sitting on the bright gold (orbGlow) surfaces.
 * White on gold lands ~2.4:1; this brown-black clears WCAG AA on both the
 * light (#c9a227) and dark (#e8c547) gold at >5:1.
 */
export const ON_GOLD_INK = "#3a2a06";

export const GAME_TIMINGS = {
  hopMs: 120,
  ladderStepMs: 40,
  snakeStepMs: 50,
  diceDurationMs: 600,
  diceRollDurationMs: 920,
  cpuThinkMs: 900,
} as const;
