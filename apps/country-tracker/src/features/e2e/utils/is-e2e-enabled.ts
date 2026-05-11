import { env } from "@/constants/env";

/**
 * E2E auth bypass guard.
 *
 * Both gates must be true:
 * - `__DEV__`: false in production bundles (Metro/Hermes minifier strips
 *   `if (__DEV__)` branches via dead code elimination)
 * - `EXPO_PUBLIC_E2E_MODE === "true"`: explicit opt-in per build env
 *
 * Production builds (eas build --profile production) MUST NOT set
 * EXPO_PUBLIC_E2E_MODE. The `__DEV__` guard is a defense-in-depth
 * in case the env flag is accidentally set.
 */
export function isE2EEnabled(): boolean {
  if (!__DEV__) return false;
  return env.EXPO_PUBLIC_E2E_MODE === "true";
}
