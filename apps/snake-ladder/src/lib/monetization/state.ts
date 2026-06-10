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

export function parseMonetization(raw: string | null): MonetizationState {
  if (!raw) return DEFAULT_MONETIZATION;
  try {
    const parsed = JSON.parse(raw) as Partial<MonetizationState>;
    return { ...DEFAULT_MONETIZATION, ...parsed };
  } catch {
    return DEFAULT_MONETIZATION;
  }
}
