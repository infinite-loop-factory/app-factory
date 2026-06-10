/**
 * Daily board: everyone gets the same starting qubit layout for the day
 * (Wordle-style). Collapse outcomes stay quantum-random — same board,
 * different fates.
 */
import { PLACEMENT_MAX, PLACEMENT_MIN } from "@/game/constants/board";

export type DailyPlacement = {
  cell: number;
  owner: 0 | 1;
  configIndex: number;
};

/** Deterministic 32-bit PRNG — tiny and good enough for layouts. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAILY_EPOCH_UTC = Date.UTC(2026, 0, 1);

/** Local-date daily number: #1 on 2026-01-01. */
export function getDailyNumber(date: Date): number {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((local - DAILY_EPOCH_UTC) / 86_400_000) + 1;
}

/** Seed derived from the local calendar date (YYYYMMDD). */
export function getDailySeed(date: Date): number {
  return (
    date.getFullYear() * 10_000 + (date.getMonth() + 1) * 100 + date.getDate()
  );
}

function shuffled<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const a = out[i] as T;
    out[i] = out[j] as T;
    out[j] = a;
  }
  return out;
}

/**
 * 10 distinct cells (5 per player) within the legal placement range, with
 * each player's five configs (0–4) in seed-shuffled order.
 */
export function generateDailyPlacements(seed: number): DailyPlacement[] {
  const rand = mulberry32(seed);
  const cells = new Set<number>();
  while (cells.size < 10) {
    const cell =
      PLACEMENT_MIN + Math.floor(rand() * (PLACEMENT_MAX - PLACEMENT_MIN + 1));
    cells.add(cell);
  }
  const cellList = [...cells];
  const youConfigs = shuffled([0, 1, 2, 3, 4], rand);
  const cpuConfigs = shuffled([0, 1, 2, 3, 4], rand);

  return cellList.map((cell, index) => {
    const owner: 0 | 1 = index < 5 ? 0 : 1;
    const configs = owner === 0 ? youConfigs : cpuConfigs;
    return { cell, owner, configIndex: configs[index % 5] as number };
  });
}
