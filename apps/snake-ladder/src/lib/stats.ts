export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
}

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
};

/** Clamp to a non-negative integer; reject NaN/strings/negatives from tampered storage. */
function safeCount(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export function parseStats(raw: string | null): GameStats {
  if (!raw) return DEFAULT_STATS;
  try {
    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return {
      gamesPlayed: safeCount(parsed.gamesPlayed, DEFAULT_STATS.gamesPlayed),
      wins: safeCount(parsed.wins, DEFAULT_STATS.wins),
      losses: safeCount(parsed.losses, DEFAULT_STATS.losses),
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function winRate(stats: GameStats): number {
  if (stats.gamesPlayed === 0) return 0;
  return Math.round((stats.wins / stats.gamesPlayed) * 100);
}
