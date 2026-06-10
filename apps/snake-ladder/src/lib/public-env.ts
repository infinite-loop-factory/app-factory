/** Read EXPO_PUBLIC_* vars at runtime (avoids babel static inlining in tests). */
export function readPublicEnv(suffix: string): string | undefined {
  return process.env[`EXPO_PUBLIC_${suffix}`];
}
