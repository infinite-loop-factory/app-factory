/** Standard die: opposite faces sum to 7 (1↔6, 2↔5, 3↔4). */
export type DiceFaceValue = 1 | 2 | 3 | 4 | 5 | 6;

export type FaceRotation = { rotateX: number; rotateY: number };

/**
 * Cube rotation (degrees, screen coords) that lands each face on TOP —
 * physical dice convention: the rolled value is the face pointing up.
 * Cameras look down at the die so the top face reads clearly.
 */
export const FACE_ROTATIONS: Record<DiceFaceValue, FaceRotation> = {
  1: { rotateX: 90, rotateY: 0 },
  2: { rotateX: 90, rotateY: -90 },
  3: { rotateX: 0, rotateY: 0 },
  4: { rotateX: 180, rotateY: 0 },
  5: { rotateX: 90, rotateY: 90 },
  6: { rotateX: -90, rotateY: 0 },
};

export function normalizeDegrees(value: number): number {
  const mod = value % 360;
  return mod < 0 ? mod + 360 : mod;
}

export function settleRotation(
  current: number,
  target: number,
  extraSpins = 2,
): number {
  const base = normalizeDegrees(target);
  const cur = normalizeDegrees(current);
  let delta = base - cur;
  if (delta < 0) delta += 360;
  return current + extraSpins * 360 + delta;
}
