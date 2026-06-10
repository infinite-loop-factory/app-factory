/** Standard die: opposite faces sum to 7 (1↔6, 2↔5, 3↔4). */
export type DiceFaceValue = 1 | 2 | 3 | 4 | 5 | 6;

export type FaceRotation = { rotateX: number; rotateY: number };

/** Cube rotation (degrees) that brings each face toward the camera. */
export const FACE_ROTATIONS: Record<DiceFaceValue, FaceRotation> = {
  1: { rotateX: 0, rotateY: 0 },
  2: { rotateX: 0, rotateY: -90 },
  3: { rotateX: 90, rotateY: 0 },
  4: { rotateX: -90, rotateY: 0 },
  5: { rotateX: 0, rotateY: 90 },
  6: { rotateX: 0, rotateY: 180 },
};

export type CubeFaceTransform = {
  face: DiceFaceValue;
  rotateX: number;
  rotateY: number;
};

/**
 * Local transform for each face panel before the cube wrapper rotates.
 * Half-edge translation uses translateZ(size / 2) in the face component.
 */
export const CUBE_FACE_TRANSFORMS: CubeFaceTransform[] = [
  { face: 1, rotateX: 0, rotateY: 0 },
  { face: 6, rotateX: 0, rotateY: 180 },
  { face: 2, rotateX: 0, rotateY: 90 },
  { face: 5, rotateX: 0, rotateY: -90 },
  { face: 3, rotateX: -90, rotateY: 0 },
  { face: 4, rotateX: 90, rotateY: 0 },
];

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
