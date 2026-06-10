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

export function parseStats(raw: string | null): GameStats {
  if (!raw) return DEFAULT_STATS;
  try {
    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function winRate(stats: GameStats): number {
  if (stats.gamesPlayed === 0) return 0;
  return Math.round((stats.wins / stats.gamesPlayed) * 100);
}
