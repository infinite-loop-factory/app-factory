export interface MonetizationState {
  goldDiceCount: number;
  adRemovalPurchased: boolean;
  gamesSinceLastAd: number;
  lastAdShownAt: number;
}

export const DEFAULT_MONETIZATION: MonetizationState = {
  goldDiceCount: 0,
  adRemovalPurchased: false,
  gamesSinceLastAd: 0,
  lastAdShownAt: 0,
};

/** Clamp to a non-negative integer; reject NaN/strings/negatives from tampered storage. */
function safeCount(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export function parseMonetization(raw: string | null): MonetizationState {
  if (!raw) return DEFAULT_MONETIZATION;
  try {
    const parsed = JSON.parse(raw) as Partial<MonetizationState>;
    return {
      goldDiceCount: safeCount(
        parsed.goldDiceCount,
        DEFAULT_MONETIZATION.goldDiceCount,
      ),
      adRemovalPurchased: parsed.adRemovalPurchased === true,
      gamesSinceLastAd: safeCount(
        parsed.gamesSinceLastAd,
        DEFAULT_MONETIZATION.gamesSinceLastAd,
      ),
      lastAdShownAt: safeCount(
        parsed.lastAdShownAt,
        DEFAULT_MONETIZATION.lastAdShownAt,
      ),
    };
  } catch {
    return DEFAULT_MONETIZATION;
  }
}
