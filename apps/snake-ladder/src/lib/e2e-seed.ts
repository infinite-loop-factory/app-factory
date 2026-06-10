import { DEFAULT_MONETIZATION } from "@/lib/monetization/state";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { STORAGE_KEYS } from "@/lib/storage-keys";

export function isE2E(): boolean {
  return process.env.EXPO_PUBLIC_E2E === "1";
}

export function e2eGoldDiceCount(): number {
  const raw = process.env.EXPO_PUBLIC_E2E_GOLD_DICE ?? "10";
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

export const E2E_SETTINGS = {
  ...DEFAULT_SETTINGS,
  reducedMotion: true,
  movementSpeed: "fast" as const,
  diceSpeed: "fast" as const,
};

export const E2E_MONETIZATION = {
  ...DEFAULT_MONETIZATION,
  goldDiceCount: e2eGoldDiceCount(),
};

export const E2E_STORAGE_SEED: Record<string, string> = {
  [STORAGE_KEYS.onboardingComplete]: "true",
  [STORAGE_KEYS.settings]: JSON.stringify(E2E_SETTINGS),
  [STORAGE_KEYS.monetization]: JSON.stringify(E2E_MONETIZATION),
};
