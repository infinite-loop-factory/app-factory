import { CRAFT_LIGHT } from "@/game/constants/palettes";

/** Craft Board design tokens — light palette default for tests */
export const CRAFT = CRAFT_LIGHT;

export const GAME_TIMINGS = {
  hopMs: 120,
  ladderStepMs: 40,
  snakeStepMs: 50,
  diceDurationMs: 600,
  diceRollDurationMs: 920,
  cpuThinkMs: 900,
} as const;
