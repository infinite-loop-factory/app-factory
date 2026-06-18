export type MovementSpeed = "slow" | "normal" | "fast";
export type DiceSpeed = "slow" | "normal" | "fast";
export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  movementSpeed: MovementSpeed;
  diceSpeed: DiceSpeed;
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  theme: ThemeMode;
  /** Empty = localized default ("Computer" / "컴퓨터") */
  opponentNickname: string;
  /** Empty = localized default ("You" / "나") */
  playerNickname: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  movementSpeed: "normal",
  diceSpeed: "normal",
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  theme: "light",
  opponentNickname: "",
  playerNickname: "",
};

const DISPLAY_NAME_MAX_LEN = 16;

export function resolveDisplayName(nickname: string, fallback: string): string {
  const trimmed = nickname.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, DISPLAY_NAME_MAX_LEN);
}

// Paced so the board camera (zoom-in ~340ms) catches the moving token.
const MOVEMENT_HOP_MS: Record<MovementSpeed, number> = {
  slow: 280,
  normal: 190,
  fast: 110,
};

const MOVEMENT_LADDER_STEP_MS: Record<MovementSpeed, number> = {
  slow: 150,
  normal: 90,
  fast: 55,
};

const MOVEMENT_SNAKE_STEP_MS: Record<MovementSpeed, number> = {
  slow: 160,
  normal: 100,
  fast: 60,
};

const DICE_DURATION_MS: Record<DiceSpeed, number> = {
  slow: 1400,
  normal: 600,
  fast: 350,
};

export interface ResolvedTimings {
  hopMs: number;
  ladderStepMs: number;
  snakeStepMs: number;
  diceDurationMs: number;
  /** Cinematic roll length (>= diceDurationMs). */
  diceRollDurationMs: number;
  cpuThinkMs: number;
}

export function resolveTimings(settings: AppSettings): ResolvedTimings {
  const diceDurationMs = DICE_DURATION_MS[settings.diceSpeed];

  return {
    hopMs: MOVEMENT_HOP_MS[settings.movementSpeed],
    ladderStepMs: MOVEMENT_LADDER_STEP_MS[settings.movementSpeed],
    snakeStepMs: MOVEMENT_SNAKE_STEP_MS[settings.movementSpeed],
    diceDurationMs,
    diceRollDurationMs: Math.max(diceDurationMs, 920),
    cpuThinkMs: 900,
  };
}

const MOVEMENT_SPEEDS: readonly MovementSpeed[] = ["slow", "normal", "fast"];
const DICE_SPEEDS: readonly DiceSpeed[] = ["slow", "normal", "fast"];
const THEME_MODES: readonly ThemeMode[] = ["light", "dark", "system"];

/** Keep `value` only when it is one of `allowed`; otherwise fall back. */
function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function boolOr(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function stringOr(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

export function parseSettings(raw: string | null): AppSettings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      movementSpeed: oneOf(
        parsed.movementSpeed,
        MOVEMENT_SPEEDS,
        DEFAULT_SETTINGS.movementSpeed,
      ),
      diceSpeed: oneOf(
        parsed.diceSpeed,
        DICE_SPEEDS,
        DEFAULT_SETTINGS.diceSpeed,
      ),
      soundEnabled: boolOr(parsed.soundEnabled, DEFAULT_SETTINGS.soundEnabled),
      musicEnabled: boolOr(parsed.musicEnabled, DEFAULT_SETTINGS.musicEnabled),
      hapticsEnabled: boolOr(
        parsed.hapticsEnabled,
        DEFAULT_SETTINGS.hapticsEnabled,
      ),
      theme: oneOf(parsed.theme, THEME_MODES, DEFAULT_SETTINGS.theme),
      opponentNickname: stringOr(
        parsed.opponentNickname,
        DEFAULT_SETTINGS.opponentNickname,
      ),
      playerNickname: stringOr(
        parsed.playerNickname,
        DEFAULT_SETTINGS.playerNickname,
      ),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
