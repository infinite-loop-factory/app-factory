/**
 * Local daily-board progress: attempts per board and the completion streak.
 * Everything stays on device — no server.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDailySeed } from "@/game/lib/daily";
import { STORAGE_KEYS } from "@/lib/storage-keys";

export type DailyProgress = {
  /** Seed of the board the attempt counter refers to. */
  attemptSeed: number | null;
  attempts: number;
  /** Seed of the last daily board the player finished. */
  completedSeed: number | null;
  streak: number;
};

export const EMPTY_DAILY_PROGRESS: DailyProgress = {
  attemptSeed: null,
  attempts: 0,
  completedSeed: null,
  streak: 0,
};

/** Seed of the calendar day before `date` (local time). */
export function previousDaySeed(date: Date): number {
  const prev = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  prev.setDate(prev.getDate() - 1);
  return getDailySeed(prev);
}

/** Pure attempt bump — counter resets when the board changes. */
export function bumpAttempts(
  progress: DailyProgress,
  seed: number,
): DailyProgress {
  if (progress.attemptSeed === seed) {
    return { ...progress, attempts: progress.attempts + 1 };
  }
  return { ...progress, attemptSeed: seed, attempts: 1 };
}

/**
 * Pure streak update on finishing a board: extends when yesterday's board
 * was completed, restarts at 1 otherwise, and never double-counts a day.
 */
export function applyCompletion(
  progress: DailyProgress,
  seed: number,
  yesterdaySeed: number,
): DailyProgress {
  if (progress.completedSeed === seed) return progress;
  const streak =
    progress.completedSeed === yesterdaySeed ? progress.streak + 1 : 1;
  return { ...progress, completedSeed: seed, streak };
}

/** Clamp to a non-negative integer; reject NaN/strings/negatives from tampered storage. */
function safeCount(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

/** Seeds are integers or null; reject any other shape. */
function safeSeed(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.floor(value)
    : null;
}

export function parseDailyProgress(raw: string | null): DailyProgress {
  if (!raw) return EMPTY_DAILY_PROGRESS;
  try {
    const parsed = JSON.parse(raw) as Partial<DailyProgress>;
    return {
      attemptSeed: safeSeed(parsed.attemptSeed),
      attempts: safeCount(parsed.attempts, EMPTY_DAILY_PROGRESS.attempts),
      completedSeed: safeSeed(parsed.completedSeed),
      streak: safeCount(parsed.streak, EMPTY_DAILY_PROGRESS.streak),
    };
  } catch {
    return EMPTY_DAILY_PROGRESS;
  }
}

export async function loadDailyProgress(): Promise<DailyProgress> {
  return parseDailyProgress(
    await AsyncStorage.getItem(STORAGE_KEYS.dailyProgress),
  );
}

async function save(progress: DailyProgress): Promise<DailyProgress> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.dailyProgress,
    JSON.stringify(progress),
  );
  return progress;
}

/** Call when a daily board starts; returns the updated attempt count. */
export async function recordDailyStart(seed: number): Promise<DailyProgress> {
  return save(bumpAttempts(await loadDailyProgress(), seed));
}

/** Call when a daily board finishes; returns the updated streak. */
export async function recordDailyCompletion(
  seed: number,
  now: Date,
): Promise<DailyProgress> {
  return save(
    applyCompletion(await loadDailyProgress(), seed, previousDaySeed(now)),
  );
}
