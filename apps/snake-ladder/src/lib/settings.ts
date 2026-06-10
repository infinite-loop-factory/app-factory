export type MovementSpeed = "slow" | "normal" | "fast";
export type DiceSpeed = "slow" | "normal" | "fast";
export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  movementSpeed: MovementSpeed;
  diceSpeed: DiceSpeed;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
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
  hapticsEnabled: true,
  reducedMotion: false,
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

/** @deprecated use resolveDisplayName */
export function resolveOpponentName(
  nickname: string,
  fallback: string,
): string {
  return resolveDisplayName(nickname, fallback);
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
  /** Cinematic roll length (>= diceDurationMs when motion is enabled). */
  diceRollDurationMs: number;
  cpuThinkMs: number;
}

function resolveDiceDurationMs(settings: AppSettings): number {
  return Math.round(
    DICE_DURATION_MS[settings.diceSpeed] * (settings.reducedMotion ? 0.5 : 1),
  );
}

export function resolveTimings(settings: AppSettings): ResolvedTimings {
  const motionScale = settings.reducedMotion ? 0.35 : 1;
  const diceDurationMs = resolveDiceDurationMs(settings);
  const diceRollDurationMs = settings.reducedMotion
    ? diceDurationMs
    : Math.max(diceDurationMs, 920);

  return {
    hopMs: Math.round(MOVEMENT_HOP_MS[settings.movementSpeed] * motionScale),
    ladderStepMs: Math.round(
      MOVEMENT_LADDER_STEP_MS[settings.movementSpeed] * motionScale,
    ),
    snakeStepMs: Math.round(
      MOVEMENT_SNAKE_STEP_MS[settings.movementSpeed] * motionScale,
    ),
    diceDurationMs,
    diceRollDurationMs,
    cpuThinkMs: settings.reducedMotion ? 400 : 900,
  };
}

export function parseSettings(raw: string | null): AppSettings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
