import { requireOptionalNativeModule } from "expo-modules-core";

/**
 * expo-iap needs the ExpoIap native module, which is absent when the
 * installed binary predates the dependency (stale dev client, Expo Go) or
 * the platform has no store (web). Importing expo-iap is NOT a safe probe:
 * on web the import succeeds and the crash happens later inside useIAP's
 * listener setup. Ask expo-modules-core for the native module directly —
 * it returns null instead of throwing when the module is missing.
 */
let cached: boolean | null = null;

export function isIapAvailable(): boolean {
  if (cached !== null) return cached;
  try {
    cached = requireOptionalNativeModule("ExpoIap") !== null;
  } catch {
    cached = false;
  }
  return cached;
}

/** Test-only escape hatch. */
export function resetIapAvailabilityForTests(): void {
  cached = null;
}
