/**
 * expo-iap throws "Cannot find native module 'ExpoIap'" at import time when
 * the installed binary predates the dependency (stale dev client, Expo Go)
 * or the platform has no store (web). Probe once instead of crashing.
 */
let cached: boolean | null = null;

export function isIapAvailable(): boolean {
  if (cached !== null) return cached;
  try {
    require("expo-iap");
    cached = true;
  } catch {
    cached = false;
  }
  return cached;
}

/** Test-only escape hatch. */
export function resetIapAvailabilityForTests(): void {
  cached = null;
}
